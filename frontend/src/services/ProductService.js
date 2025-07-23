import api from "../api/api";

/**
 * ProductService provides methods for product-related API calls.
 */
const ProductService = {
  // Get all products (optionally with query params for filtering)
  getAllProducts: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  // Get a single product by ID
  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Alias for consistency with ProductDetails component
  getById: async (productId) => {
    return ProductService.getProductById(productId);
  },

  // Create a new product
  createProduct: async (productData) => {
    const response = await api.post("/products", productData);
    return response.data;
  },

  // Update an existing product
  updateProduct: async (productId, updateData) => {
    const response = await api.put(`/products/${productId}`, updateData);
    return response.data;
  },

  // Delete a product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  }
};

export default ProductService;