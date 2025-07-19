import api from "../api/api";

/**
 * WishlistService provides methods for wishlist-related API calls.
 */
const WishlistService = {
  // Get all wishlist items for the current user
  getWishlist: async () => {
    try {
      const response = await api.get("/v1/wishlist");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      throw error;
    }
  },

  // Add a product to the wishlist
  addToWishlist: async (productId) => {
    try {
      const response = await api.post("/v1/wishlist", { productId });
      return response.data;
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      throw error;
    }
  },

  // Remove a product from the wishlist
  removeFromWishlist: async (productId) => {
    try {
      const response = await api.delete(`/v1/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      throw error;
    }
  }
};

export default WishlistService; 