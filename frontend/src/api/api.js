import axios from "axios";
import { getToken, removeToken } from "../utils/tokenUtils";

// Create Axios instance with base config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
});

// Attach the token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug: log outgoing request
    console.log('[API] Request:', config.method?.toUpperCase(), config.url, config);
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Global error handler
api.interceptors.response.use(
  (response) => {
    // Debug: log response
    console.log('[API] Response:', response.config.url, response);
    return response;
  },
  (error) => {
    // Debug: log error
    console.error('[API] Error:', error.config?.url, error);
    // Handle 401 globally: auto-logout and redirect to login
    if (error.response && error.response.status === 401) {
      removeToken();
      // Only redirect if not already on /login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (error.response && error.response.status === 403) {
      // Show a user-friendly error for forbidden
      alert('You do not have permission to access this resource.');
    }
    return Promise.reject(error);
  }
);

export default api;