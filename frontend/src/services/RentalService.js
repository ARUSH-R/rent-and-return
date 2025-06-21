import api from '../api/api';

const RentalService = {
  // Get all rentals for admin
  getAllRentals: () => api.get('/rentals'),

  // Get rentals for logged-in user
  getMyRentals: () => api.get('/rentals/my'),

  // Get rental by ID
  getRentalById: (id) => api.get(`/rentals/${id}`),

  // Create a new rental (user)
  createRental: (rentalData) => api.post('/rentals', rentalData),

  // Update a rental (admin only)
  updateRental: (id, rentalData) => api.put(`/rentals/${id}`, rentalData),

  // Delete rental (admin only)
  deleteRental: (id) => api.delete(`/rentals/${id}`),
};

export default RentalService;
