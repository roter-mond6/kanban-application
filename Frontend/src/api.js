import axios from "axios";

export const API_BASE_URL = "https://kanban-application-5l4z.onrender.com";

// 1. Define the api instance FIRST
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 2. NOW apply the interceptor to it
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Checks if the request is going to your backend before adding token
    if (token && config.url && config.url.startsWith(API_BASE_URL)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
