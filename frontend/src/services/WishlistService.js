import api from "../api/api";

/**
 * WishlistService provides methods for wishlist-related API calls.
 */
const WishlistService = {
  // Get all wishlist items for the current user
  getWishlist: async () => {
    const response = await api.get("/v1/wishlist");
    return response.data;
  },

  // Add a product to the wishlist
  addToWishlist: async (productId) => {
    const response = await api.post("/v1/wishlist", { productId });
    return response.data;
  },

  // Remove a product from the wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/v1/wishlist/${productId}`);
    return response.data;
  }
};

export default WishlistService; 