import api from "../api/api";

/**
 * AuthService provides methods for authentication-related API calls.
 */
const AuthService = {
  // Log in the user with credentials (identifier, password)
  login: async (identifier, password) => {
    const response = await api.post("/auth/login", { identifier, password });
    return response.data;
  },

  // Register a new user (username, email, password)
  register: async ({ username, email, password }) => {
    const response = await api.post("/auth/register", { username, email, password });
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
