import api from "../api/api";

/**
 * AuthService provides methods for authentication-related API calls.
 */
const AuthService = {
  // Log in the user with credentials (e.g., { email, password })
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Register a new user (e.g., { name, email, password })
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Log out the current user
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Get the currently authenticated user's info
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  }
};


// Function to initialize auth system - checks for existing token
export function setupAuthToken() {
  // This function initializes the auth system
  // The token is automatically retrieved by the API interceptor
  // You can add additional initialization logic here if needed
}

export default AuthService;
