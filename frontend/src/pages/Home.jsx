import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRightIcon, StarIcon, ShoppingCartIcon, HeartIcon, TruckIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import api from '../api/api';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  // Move heroSlides declaration to the top
  const heroSlides = [
    {
      id: 1,
      image: '/assets/slide1.jpg',
      title: 'Welcome to Rent & Return',
      description: 'Find the best products to rent and return with ease.'
    },
    {
      id: 2,
      image: '/assets/slide2.jpg',
      title: 'Hassle-Free Rentals',
      description: 'Enjoy a seamless rental experience with us.'
    },
    {
      id: 3,
      image: '/assets/slide3.jpg',
      title: 'Wide Range of Products',
      description: 'Choose from a variety of products for all your needs.'
    }
  ];
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await api.get('/products');
      console.log('Products response:', response.data);
      const allProducts = response.data;
      setProducts(allProducts);
      setFeaturedProducts(allProducts.slice(0, 6));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setCartLoading(prev => ({ ...prev, [productId]: true }));
    try {
      await api.post('/cart', { productId, quantity: 1 });
      toast.success('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setCartLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const features = [
    {
      icon: TruckIcon,
      title: "Free Delivery",
      description: "Free delivery on orders over ₹500"
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Payment",
      description: "100% secure payment processing"
    },
    {
      icon: ClockIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer support"
    }
  ];

  const categories = [
    {
      name: "Electronics",
      image: "/assets/electronics.jpg",
      count: products.filter(p => p.category === 'Electronics').length
    },
    {
      name: "Sports",
      image: "/assets/sports.jpg",
      count: products.filter(p => p.category === 'Sports').length
    },
    {
      name: "Books",
      image: "/assets/books.jpg",
      count: products.filter(p => p.category === 'Books').length
    }
  ];

  const ProductCard = ({ product }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200';
          }}
        />
        <div className="absolute top-3 right-3">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <HeartIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 rounded-md text-sm font-medium">
          Available
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarSolid key={i} className="h-4 w-4 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">(4.5)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">₹{product.pricePerDay}</span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
          <button
            onClick={() => addToCart(product.id)}
            disabled={cartLoading[product.id]}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {cartLoading[product.id] ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <ShoppingCartIcon className="h-4 w-4" />
            )}
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  console.log('Rendering Home component with:', { products, featuredProducts, loading });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Carousel - Simple version */}
      <div className="relative w-full mb-8">
        <div className="h-[300px] w-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl font-bold mb-4">RentReturn</h1>
            <p className="text-lg mb-4">Your trusted rental platform</p>
            <p className="text-sm opacity-75">Products loaded: {products.length}</p>
            <p className="text-sm opacity-75">Featured products: {featuredProducts.length}</p>
          </div>
        </div>
      </div>

      {/* Simple Hero Carousel */}
      <div className="relative w-full">
        <div className="h-[250px] w-full relative overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x500/cccccc/666666?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold mb-4"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl mb-8"
                  >
                    {slide.description}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Shop Now
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
          {/* Carousel Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Discover our wide range of rental categories</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div className="aspect-w-16 aspect-h-10 rounded-xl overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} items available</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600">Hand-picked items for you</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              View All
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-orange-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white/90 mb-8">Get the latest deals and updates delivered to your inbox</p>
          <div className="flex justify-center">
            <div className="flex w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-0 focus:outline-none"
              />
              <button className="bg-black text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
