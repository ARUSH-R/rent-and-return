import api from "../api/api";

/**
 * CartService provides methods for cart-related API calls.
 */
const CartService = {
  // Get the current user's cart items
  getCart: async () => {
    const response = await api.get("/cart");
    return response.data;
  },

  // Add an item to the cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post("/cart", { productId, quantity });
    return response.data;
  },

  // Update the quantity or details of a cart item
  updateCartItem: async (itemId, updateData) => {
    const response = await api.put(`/cart/${itemId}`, updateData);
    return response.data;
  },

  // Update quantity of a cart item
  updateQuantity: async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  // Remove an item from the cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  },

  // Clear the entire cart
  clearCart: async () => {
    const response = await api.delete("/cart");
    return response.data;
  }
};

export default CartService;