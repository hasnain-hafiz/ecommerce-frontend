import axios from "axios";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: `${API}/api/v1`
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if(error.response && error.response.status ===401){
//             localStorage.removeItem("token");
//             window.location.href="/auth";
//         }

//         return Promise.reject(error);
//     }
// )


export default api;