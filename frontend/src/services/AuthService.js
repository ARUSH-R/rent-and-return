import api from "../api/api";

/**
 * AuthService provides methods for authentication-related API calls.
 */
const AuthService = {
  // Log in the user with credentials (e.g., { email, password })
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // Register a new user (e.g., { name, email, password })
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // Log out the current user
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  // Get the currently authenticated user's info
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Fetching current user failed:", error);
      throw error;
    }
  }
};

export default AuthService;