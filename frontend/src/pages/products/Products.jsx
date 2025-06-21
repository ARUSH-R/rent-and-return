import React, { useEffect, useState } from 'react';
import ProductService from '../../services/ProductService';
import Loader from '../../components/Loader';
import { useAuth } from '../../auth/useAuth';
import { isAdmin } from '../../utils/roleUtils';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    ProductService.getAllProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => setError('Failed to fetch products.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    ProductService.deleteProduct(id)
      .then(() => setProducts((prev) => prev.filter((p) => p.id !== id)))
      .catch(() => alert('Failed to delete product.'));
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        {isAdmin(user) && (
          <Link
            to="/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Add Product
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="mt-2 font-semibold">₹{product.price}</p>
                <p
                  className={`mt-1 text-sm font-medium ${
                    product.available ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {product.available ? 'Available' : 'Unavailable'}
                </p>
              </div>

              {isAdmin(user) && (
                <div className="mt-4 flex justify-end gap-2">
                  <Link
                    to={`/products/edit/${product.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
