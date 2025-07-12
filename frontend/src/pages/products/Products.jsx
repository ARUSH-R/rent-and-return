import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import api from "../../api/api";

/**
 * Products Page
 * - Displays a list/grid of products
 * - Allows navigation to product details and (if admin) to add/edit products
 */
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.get("/products")
      .then((res) => {
        const data = res.data;
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
        setFilteredProducts(productList);
      })
      .catch((err) => setError(err.message || "Failed to fetch products"))
      .finally(() => setLoading(false));
  }, []);

  // Filter products based on category and search term
  useEffect(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  // Get unique categories
  const categories = ["All", ...new Set(products.map(product => product.category))];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // TODO: Replace with actual user/admin role logic
  const isAdmin = window.localStorage.getItem("isAdmin") === "true";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-blue-700">Products</h2>
        {isAdmin && (
          <Link
            to="/products/new"
            className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition"
          >
            Add Product
          </Link>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="text-red-600 py-12 text-center">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-gray-500 py-12 text-center">
          No products available.
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category
                      ? "bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4 text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-gray-500 py-12 text-center">
              No products found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-48 w-full object-contain border-b rounded-t"
              />
              <div className="flex-1 flex flex-col p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-lg text-blue-700">
                    {product.name}
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <div className="text-gray-600 flex-1 mb-2">{product.description}</div>
                <div className="mt-3 font-bold text-xl text-blue-700">
                  ₹{product.pricePerDay}/day
                </div>
                {isAdmin && (
                  <Link
                    to={`/products/edit/${product.id}`}
                    className="mt-4 inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium hover:bg-blue-200 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                )}
              </div>
            </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;