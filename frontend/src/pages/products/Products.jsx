import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import Button from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { motion } from "framer-motion";
import api from "../../api/api";
import ProductSidebar from '../../components/Sidebar';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline';

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
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortOption, setSortOption] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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

  useEffect(() => {
    // Fetch wishlist on mount
    const fetchWishlist = async () => {
      setWishlistLoading(true);
      try {
        const res = await api.get('/v1/wishlist');
        setWishlist(res.data.map(item => item.productId));
      } catch (e) {
        setWishlist([]);
      } finally {
        setWishlistLoading(false);
      }
    };
    fetchWishlist();
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
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.pricePerDay || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Sorting
    if (sortOption === "price-asc") {
      filtered = [...filtered].sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
    } else if (sortOption === "price-desc") {
      filtered = [...filtered].sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
    } else if (sortOption === "name-asc") {
      filtered = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOption === "name-desc") {
      filtered = [...filtered].sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, priceRange, sortOption]);

  const toggleWishlist = async (productId) => {
    setWishlistLoading(true);
    try {
      if (wishlist.includes(productId)) {
        await api.delete(`/v1/wishlist/${productId}`);
        setWishlist(wishlist.filter(id => id !== productId));
      } else {
        await api.post('/v1/wishlist', { productId });
        setWishlist([...wishlist, productId]);
      }
    } catch (e) {}
    setWishlistLoading(false);
  };

  // Get unique categories
  const categories = ["All", ...new Set(products.map(product => product.category || 'Uncategorized').filter(Boolean))];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // TODO: Replace with actual user/admin role logic
  const isAdmin = window.localStorage.getItem("isAdmin") === "true";

  // Number of available product images
  const NUM_PRODUCT_IMAGES = 200;

  return (
    <div className="flex flex-row items-stretch min-h-screen bg-gray-50">
      {/* Sidebar for filters/sorting */}
      <div className="relative w-64 h-full">
        <ProductSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />
      </div>
      {/* Main content */}
      <div className="flex-1 min-w-0 ml-8 overflow-x-hidden h-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-blue-700">Products</h2>
          {isAdmin && (
            <Button asChild>
              <Link to="/products/new">
                Add Product
              </Link>
            </Button>
          )}
        </div>
        {/* Sort By and Filter By controls */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-white rounded-lg shadow-sm">
          <label className="flex items-center text-gray-700 font-semibold text-base">
            <span className="mr-2">Sort By:</span>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
          </label>
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
                {filteredProducts.map((product, index) => {
                  const imageIndex = (index % NUM_PRODUCT_IMAGES) + 1;
                  return (
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow group relative" key={product.id}>
                      {/* Heart button outside the Link */}
                      <button
                        className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md bg-white hover:bg-pink-100 transition-all ${wishlist.includes(product.id) ? 'text-pink-600' : 'text-gray-400'}`}
                        onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
                        disabled={wishlistLoading}
                        title={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        tabIndex={0}
                        type="button"
                      >
                        {wishlist.includes(product.id) ? <SolidHeartIcon className="h-6 w-6" /> : <OutlineHeartIcon className="h-6 w-6" />}
                      </button>
                      <Link to={`/products/${product.id}`} className="block group">
                        <img
                          src={product.imageUrl || '/assets/no-image.jpg'}
                          alt={product.name || 'Product'}
                          className="h-48 w-full object-cover rounded-t-lg"
                          onError={e => {
                            if (!e.target.dataset.fallback) {
                              e.target.src = '/assets/no-image.jpg';
                              e.target.dataset.fallback = 'true';
                            } else if (!e.target.dataset.cdnFallback) {
                              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                              e.target.dataset.cdnFallback = 'true';
                            }
                          }}
                        />
                        <CardHeader>
                          <CardTitle className="text-lg">{product.name || 'Unnamed Product'}</CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {product.category || 'Uncategorized'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 mb-3">
                            {product.description || 'No description available'}
                          </p>
                          <p className="font-bold text-xl text-blue-700">
                            ₹{product.pricePerDay || 0}/day
                          </p>
                        </CardContent>
                        {isAdmin && (
                          <CardFooter>
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                to={`/products/edit/${product.id}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Edit
                              </Link>
                            </Button>
                          </CardFooter>
                        )}
                      </Link>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
