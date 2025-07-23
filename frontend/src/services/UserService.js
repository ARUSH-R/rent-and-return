import api from "../api/api";

/**
 * UserService provides methods for user-related API calls.
 */
const UserService = {
  // Get the current user's profile
  getProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  // Update the user's profile
  updateProfile: async (profileData) => {
    const response = await api.put("/user/profile", profileData);
    return response.data;
  },

  // Get rentals belonging to the current user
  getMyRentals: async () => {
    const response = await api.get("/user/my-rentals");
    return response.data;
  },

  // Change user password
  changePassword: async (passwords) => {
    const response = await api.post("/user/change-password", passwords);
    return response.data;
  },

  // Fetch user dashboard summary (orders, rentals, etc.)
  getDashboardSummary: async () => {
    const response = await api.get("/dashboard/summary");
    return response.data;
  }
};

export default UserService;