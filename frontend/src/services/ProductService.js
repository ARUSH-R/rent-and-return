import api from '../api/api';

const ProductService = {
  // Get all available (not deleted) products
  getAllProducts: (params) => api.get('/products', { params }),

  // Get single product by ID (only if not deleted)
  getProductById: (id) => api.get(`/products/${id}`),

  // Create new product (admin only, owner set by backend)
  createProduct: (productData) => api.post('/products', productData),

  // Update existing product (admin only)
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),

  // Soft-delete a product (admin only)
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Restore a soft-deleted product (admin only)
  restoreProduct: (id) => api.post(`/products/${id}/restore`),

  // Mark product as available/unavailable (admin only)
  setAvailability: (id, available) => api.patch(`/products/${id}/availability`, { available }),

  // Get products by owner (for user dashboard)
  getProductsByOwner: (ownerId) => api.get(`/products?ownerId=${ownerId}`),

  // Get products by category
  getProductsByCategory: (category) => api.get(`/products?category=${category}`),
};

export default ProductService;