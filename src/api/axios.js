import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;


export const publicApi = axios.create({
    baseURL: `${API}/api/v1`
});

export const privateApi = axios.create({
    baseURL: `${API}/api/v1`
});


privateApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// CHANGED (Phase 3): previously, ANY 500 response logged the user out and
// redirected home — a genuine server error had nothing to do with the
// user's session, and an actually-expired token (which the backend
// correctly returns as 401, not 500) wasn't handled at all. Now: a 401
// triggers exactly one silent attempt to exchange the refresh token for a
// new access token and retries the original request; only if that refresh
// itself fails does the app clear the session and send the user to login.
let isRefreshing = false;
let pendingRequests = [];

const processPendingRequests = (error, newToken) => {
    pendingRequests.forEach(({ resolve, reject, config }) => {
        if (error) {
            reject(error);
            return;
        }
        config.headers.Authorization = `Bearer ${newToken}`;
        resolve(privateApi(config));
    });
    pendingRequests = [];
};

privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("seller");
            window.location.href = "/auth";
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            // A refresh is already in flight (e.g. two requests 401'd at
            // once) -- queue this request instead of firing a second
            // refresh call.
            return new Promise((resolve, reject) => {
                pendingRequests.push({ resolve, reject, config: originalRequest });
            });
        }

        isRefreshing = true;

        try {
            const res = await publicApi.post("/auth/refresh", { refreshToken });
            const { token: newToken, refreshToken: newRefreshToken } = res.data.data;

            localStorage.setItem("token", newToken);
            if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
            }

            processPendingRequests(null, newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return privateApi(originalRequest);

        } catch (refreshError) {
            processPendingRequests(refreshError, null);

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("seller");
            window.location.href = "/auth";

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
