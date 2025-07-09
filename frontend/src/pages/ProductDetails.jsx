import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../auth/AuthContext';
import Loader from '../components/Loader';
import Layout from '../components/Layout';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const productData = await ProductService.getById(id);
      setProduct(productData);
    } catch (error) {
      setError('Failed to load product details');
      console.error('Product load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      alert('Product added to cart successfully!');
    } catch (error) {
      alert('Failed to add product to cart');
      console.error('Add to cart error:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRentNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Navigate to rental form or checkout
    navigate('/rental/create', { state: { product, quantity } });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            {error || 'Product not found'}
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image || '/api/placeholder/600/600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {product.category}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-blue-600">
                  ₹{product.price}
                  <span className="text-lg font-normal text-gray-500">/day</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.available ? 'Available' : 'Not Available'}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">
                    {product.description || 'No description available.'}
                  </p>
                </div>

                {product.specifications && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Specifications
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                        {product.specifications}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.available || addingToCart}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      product.available && !addingToCart
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {addingToCart ? (
                      <span className="flex items-center justify-center">
                        <Loader size="sm" className="mr-2" />
                        Adding...
                      </span>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                  
                  <button
                    onClick={handleRentNow}
                    disabled={!product.available}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      product.available
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="ml-2 text-gray-600">{product.category}</span>
                </div>
                {product.location && (
                  <div>
                    <span className="font-medium text-gray-900">Location:</span>
                    <span className="ml-2 text-gray-600">{product.location}</span>
                  </div>
                )}
                {product.createdAt && (
                  <div>
                    <span className="font-medium text-gray-900">Listed:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
