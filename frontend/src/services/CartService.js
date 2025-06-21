import api from "../api/api";

/**
 * CartService provides methods for cart-related API calls.
 */
const CartService = {
  // Get the current user's cart items
  getCart: async () => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      throw error;
    }
  },

  // Add an item to the cart
  addToCart: async (item) => {
    try {
      const response = await api.post("/cart", item);
      return response.data;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  },

  // Update the quantity or details of a cart item
  updateCartItem: async (itemId, updateData) => {
    try {
      const response = await api.put(`/cart/${itemId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update cart item ${itemId}:`, error);
      throw error;
    }
  },

  // Remove an item from the cart
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to remove cart item ${itemId}:`, error);
      throw error;
    }
  },

  // Clear the entire cart
  clearCart: async () => {
    try {
      const response = await api.delete("/cart");
      return response.data;
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  }
};

export default CartService;