import api from "../api/api";

/**
 * ProductService provides methods for product-related API calls.
 */
const ProductService = {
  // Get all products (optionally with query params for filtering)
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    }
  },

  // Get a single product by ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
      throw error;
    }
  },

  // Alias for consistency with ProductDetails component
  getById: async (productId) => {
    return ProductService.getProductById(productId);
  },

  // Create a new product
  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      console.error("Failed to create product:", error);
      throw error;
    }
  },

  // Update an existing product
  updateProduct: async (productId, updateData) => {
    try {
      const response = await api.put(`/products/${productId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update product ${productId}:`, error);
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete product ${productId}:`, error);
      throw error;
    }
  }
};

export default ProductService;