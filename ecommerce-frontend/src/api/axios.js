import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

privateApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status ===500){
            localStorage.removeItem("token");
            localStorage.removeItem("seller");
            window.location.href("/home");
        }

        return Promise.reject(error);
    }
)


