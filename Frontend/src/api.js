import axios from "axios";

// 1. Define the api instance FIRST
const api = axios.create({
  baseURL: "https://kanban-application-5l4z.onrender.com", // Your actual Render URL
});

// 2. NOW apply the interceptor to it
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Checks if the request is going to your backend before adding token
    if (
      token &&
      config.url &&
      config.url.startsWith("https://kanban-application-5l4z.onrender.com")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
