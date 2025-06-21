import api from '../api/api';

const UserService = {
  // Get current user profile
  getProfile: () => api.get('/users/me'),

  // Update user profile info (name, etc.)
  updateProfile: (data) => api.put('/users/me', data),

  // Change password
  changePassword: (data) => api.put('/users/change-password', data),
};

export default UserService;
