import axios from "axios";

const PROD_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.sicheng55.com";

const BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : PROD_API_BASE_URL;

const request = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
});

request.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }

    return config;
});

request.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default request;
