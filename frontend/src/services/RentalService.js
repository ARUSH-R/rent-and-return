import api from "../api/api";

/**
 * RentalService provides methods for rental-related API calls.
 */
const RentalService = {
  // Get all rentals (optionally with filters or pagination)
  getAllRentals: async (params = {}) => {
    try {
      const response = await api.get("/rentals", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch rentals:", error);
      throw error;
    }
  },

  // Get a single rental by ID
  getRentalById: async (rentalId) => {
    try {
      const response = await api.get(`/rentals/${rentalId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch rental ${rentalId}:`, error);
      throw error;
    }
  },

  // Create a new rental
  createRental: async (rentalData) => {
    try {
      const response = await api.post("/rentals", rentalData);
      return response.data;
    } catch (error) {
      console.error("Failed to create rental:", error);
      throw error;
    }
  },

  // Update an existing rental
  updateRental: async (rentalId, updateData) => {
    try {
      const response = await api.put(`/rentals/${rentalId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update rental ${rentalId}:`, error);
      throw error;
    }
  },

  // Delete a rental
  deleteRental: async (rentalId) => {
    try {
      const response = await api.delete(`/rentals/${rentalId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete rental ${rentalId}:`, error);
      throw error;
    }
  }
};

export default RentalService;