import axios from "axios";
import { getToken } from "../utils/tokenUtils";

// Create Axios instance with base config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  timeout: 10000,
});

// Attach the token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally, handle 401/403 globally (e.g., logout, redirect)
    return Promise.reject(error);
  }
);

export default api;