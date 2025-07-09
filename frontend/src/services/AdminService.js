import api from "../api/api";

/**
 * AdminService provides methods for admin-related API calls.
 * All methods assume authentication and proper authorization.
 */
const AdminService = {
  // Get overall admin dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get("/admin/stats");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch admin dashboard stats:", error);
      throw error;
    }
  },

  // Alias for consistency with AdminDashboard component
  getStats: async () => {
    return AdminService.getDashboardStats();
  },

  // Get recent rentals for admin dashboard
  getRecentRentals: async (limit = 10) => {
    try {
      const response = await api.get(`/admin/rentals/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch recent rentals:", error);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get("/admin/users");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },

  // Update a user's information (admin)
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update user ${userId}:`, error);
      throw error;
    }
  },

  // Delete a user (admin)
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
      throw error;
    }
  },

  // Get all feedbacks
  getAllFeedbacks: async () => {
    try {
      const response = await api.get("/admin/feedbacks");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
      throw error;
    }
  },

  // Get all orders (if applicable)
  getAllOrders: async () => {
    try {
      const response = await api.get("/admin/orders");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  }
};

export default AdminService;