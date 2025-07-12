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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.get("/products")
      .then((res) => {
        const data = res.data;
        setProducts(Array.isArray(data) ? data : data.products || []);
      })
      .catch((err) => setError(err.message || "Failed to fetch products"))
      .finally(() => setLoading(false));
  }, []);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
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
                <div className="font-semibold text-lg text-blue-700 mb-1">
                  {product.name}
                </div>
                <div className="text-gray-600 flex-1">{product.description}</div>
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
    </div>
  );
};

export default Products;