
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('http://localhost:8080/api/auth/refresh-token', {}, { withCredentials: true });
        localStorage.setItem('accessToken', res.data.accessToken);
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
