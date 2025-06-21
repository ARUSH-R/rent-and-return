import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenUtils';

// Use HTTPS and correct port for production, fallback to dev
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:8443/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // JWT is sent in header, not cookie
});

// Attach JWT token to every request if it exists
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

// Global error handler for token expiry, forbidden, etc.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid, remove and optionally redirect
        removeToken();
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        // Forbidden, show message or redirect
        window.location.href = '/forbidden';
      }
    }
    return Promise.reject(error);
  }
);

export default api;