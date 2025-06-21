import api from '../api/api';

const CartService = {
  // Get all items in user's cart
  getCartItems: () => api.get('/cart'),

  // Add product to cart
  addToCart: (productId) => api.post(`/cart/add/${productId}`),

  // Remove product from cart
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),

  // Checkout cart (creates rentals)
  checkout: (rentalData) => api.post('/cart/checkout', rentalData),
};

export default CartService;
