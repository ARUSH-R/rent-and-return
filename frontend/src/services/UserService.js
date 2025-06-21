import api from "../api/api";

/**
 * UserService provides methods for user-related API calls.
 */
const UserService = {
  // Get the current user's profile
  getProfile: async () => {
    try {
      const response = await api.get("/user/profile");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error; // Or return a user-friendly error
    }
  },

  // Update the user's profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/user/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  },

  // Get rentals belonging to the current user
  getMyRentals: async () => {
    try {
      const response = await api.get("/user/my-rentals");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user rentals:", error);
      throw error;
    }
  },

  // Change user password
  changePassword: async (passwords) => {
    try {
      const response = await api.post("/user/change-password", passwords);
      return response.data;
    } catch (error) {
      console.error("Failed to change password:", error);
      throw error;
    }
  },

  // Fetch user dashboard summary (orders, rentals, etc.)
  getDashboardSummary: async () => {
    try {
      const response = await api.get("/dashboard/summary");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch dashboard summary:", error);
      throw error;
    }
  }
};

export default UserService;