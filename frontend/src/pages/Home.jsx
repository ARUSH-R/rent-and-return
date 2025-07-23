import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRightIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import api from '../api/api';
import { useAuth } from '../auth/AuthContextUtils';
import toast from 'react-hot-toast';
import WishlistService from '../services/WishlistService';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const navigate = useNavigate();
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
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const categoryImageMap = {
      'Electronics': '/assets/products/electronics/electronics-1.jpg',
      'Sports & Fitness': '/assets/products/sports-fitness/sports-fitness-1.jpg',
      'Books & Stationery': '/assets/products/books-stationery/books-stationery-1.jpg',
      'Home Appliances': '/assets/products/home-appliances/home-appliances-1.jpg',
      'Furniture': '/assets/products/furniture/furniture-1.jpg',
      'Vehicles': '/assets/products/vehicles/vehicles-1.jpg',
      'Tools & Equipment': '/assets/products/tools-equipment/tools-equipment-1.jpg',
      'Services': '/assets/products/services/services-1.jpg',
    };
    // Dynamically generate categories from products
    const uniqueCategories = Array.from(
      new Set(products.map(p => p.category && p.category.trim()).filter(Boolean))
    );
    const cats = uniqueCategories.map(cat => ({
      name: cat,
      image: categoryImageMap[cat] || '/assets/no-image.jpg',
      count: products.filter(p => p.category === cat).length
    }));
    setCategories(cats);
  }, [products]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    // Fetch wishlist only if user is authenticated
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setWishlist([]);
        return;
      }
      setWishlistLoading(true);
      try {
        const data = await WishlistService.getWishlist();
        setWishlist(data.map(item => item.productId));
      } catch (e) {
        setWishlist([]);
      } finally {
        setWishlistLoading(false);
      }
    };
    fetchWishlist();
  }, [isAuthenticated]); // Add isAuthenticated as dependency

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to manage your wishlist');
      return;
    }
    setWishlistLoading(true);
    try {
      if (wishlist.includes(productId)) {
        await WishlistService.removeFromWishlist(productId);
        setWishlist(wishlist.filter(id => id !== productId));
        toast.success('Removed from wishlist');
      } else {
        await WishlistService.addToWishlist(productId);
        setWishlist([...wishlist, productId]);
        toast.success('Added to wishlist');
      }
    } catch (e) {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      const allProducts = response.data;
      setProducts(allProducts);
      setFeaturedProducts(allProducts.slice(0, 6));
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    setCartLoading(prev => ({ ...prev, [productId]: true }));
    try {
      await api.post('/cart', { productId, quantity: 1 });
      toast.success('Item added to cart!');
    } catch (error) {
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

  const ProductCard = ({ product }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={product.imageUrl || 'https://placehold.co/300x200'}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x200';
          }}
        />
        <button
          className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md bg-white hover:bg-pink-100 transition-all ${wishlist.includes(product.id) ? 'text-pink-600' : 'text-gray-400'}`}
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          disabled={wishlistLoading}
          title={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlist.includes(product.id) ? <SolidHeartIcon className="h-5 w-5" /> : <OutlineHeartIcon className="h-5 w-5" />}
        </button>
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
                  e.target.src = 'https://placehold.co/1200x500/cccccc/666666?text=Image+Not+Found';
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
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/products"
                      className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Browse Products
                    </Link>
                    {!isAuthenticated ? (
                      <Link
                        to="/register"
                        className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Get Started
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        My Dashboard
                      </Link>
                    )}
                  </div>
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

      {/* Shop by Category Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map(category => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-40 object-cover"
                onError={e => { e.target.src = '/assets/no-image.jpg'; }}
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 truncate">{category.name}</h3>
                <p className="text-gray-600">{category.count} products available</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
