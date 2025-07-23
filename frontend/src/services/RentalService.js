import api from "../api/api";

/**
 * RentalService provides methods for rental-related API calls.
 */
const RentalService = {
  // Get all rentals (optionally with filters or pagination)
  getAllRentals: async (params = {}) => {
    const response = await api.get("/rentals", { params });
    return response.data;
  },

  // Get a single rental by ID
  getRentalById: async (rentalId) => {
    const response = await api.get(`/rentals/${rentalId}`);
    return response.data;
  },

  // Create a new rental
  createRental: async (rentalData) => {
    const response = await api.post("/rentals", rentalData);
    return response.data;
  },

  // Update an existing rental
  updateRental: async (rentalId, updateData) => {
    const response = await api.put(`/rentals/${rentalId}`, updateData);
    return response.data;
  },

  // Delete a rental
  deleteRental: async (rentalId) => {
    const response = await api.delete(`/rentals/${rentalId}`);
    return response.data;
  }
};

export default RentalService;