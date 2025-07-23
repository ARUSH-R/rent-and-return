import api from "../api/api";

/**
 * AdminService provides methods for admin-related API calls.
 * All methods assume authentication and proper authorization.
 */
const AdminService = {
  // Get overall admin dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  // Alias for consistency with AdminDashboard component
  getStats: async () => {
    return AdminService.getDashboardStats();
  },

  // Get recent rentals for admin dashboard
  getRecentRentals: async (limit = 10) => {
    const response = await api.get(`/admin/rentals/recent?limit=${limit}`);
    return response.data;
  },

  // Get all users
  getAllUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  // Update a user's information (admin)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete a user (admin)
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Get all feedbacks
  getAllFeedbacks: async () => {
    const response = await api.get("/admin/feedbacks");
    return response.data;
  },

  // Get all orders (if applicable)
  getAllOrders: async () => {
    const response = await api.get("/admin/orders");
    return response.data;
  }
};

export default AdminService;