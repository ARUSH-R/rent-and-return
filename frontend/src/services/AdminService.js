// src/services/AdminService.js
import api from '../api/api';

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};
