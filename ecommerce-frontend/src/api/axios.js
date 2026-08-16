import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

function readCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
}

// Public (no-auth) endpoints - still send cookies so an already-logged-in user
// gets personalized data where the backend allows it, but never triggers the
// refresh-retry dance below.
export const publicApi = axios.create({
    baseURL: `${API}/api/v1`,
    withCredentials: true,
});

// Authenticated endpoints. Auth now lives entirely in httpOnly cookies set by
// the backend - there is no token in JS-reachable storage, so an XSS bug can't
// steal a session the way it could with localStorage.
export const privateApi = axios.create({
    baseURL: `${API}/api/v1`,
    withCredentials: true,
});

function attachCsrfHeader(config) {
    const csrfToken = readCookie("XSRF-TOKEN");
    if (csrfToken && ["post", "put", "patch", "delete"].includes((config.method || "").toLowerCase())) {
        config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
    return config;
}

publicApi.interceptors.request.use(attachCsrfHeader);
privateApi.interceptors.request.use(attachCsrfHeader);

let refreshPromise = null;

function refreshSession() {
    if (!refreshPromise) {
        refreshPromise = publicApi.post("/auth/refresh").finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
}

// Primes the XSRF-TOKEN cookie. Spring Security's CSRF token is resolved
// lazily, so without this the very first mutating request (e.g. login) would
// have no token to send. Safe to call multiple times; cheap no-op after the
// cookie exists.
export function primeCsrfToken() {
    return publicApi.get("/csrf").catch(() => {});
}

privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        // One silent refresh-and-retry on a 401, so a short-lived access token
        // expiring mid-session doesn't log the user out unexpectedly.
        if (response && response.status === 401 && !config._retried) {
            config._retried = true;
            try {
                await refreshSession();
                return privateApi(config);
            } catch (refreshError) {
                window.dispatchEvent(new CustomEvent("auth:expired"));
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
