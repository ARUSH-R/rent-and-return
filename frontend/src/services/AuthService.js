import api from '../api/api';
import { setToken, removeToken } from '../utils/tokenUtils';

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  setToken(token);
  return user;
};

const register = async (name, email, password) => {
  await api.post('/auth/register', { name, email, password });
};

const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const logout = () => {
  removeToken();
};

export default {
  login,
  register,
  getCurrentUser,
  logout,
};
