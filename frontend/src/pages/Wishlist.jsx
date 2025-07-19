import React, { useEffect, useState } from "react";
import WishlistService from "../services/WishlistService";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Heart as SolidHeart } from "lucide-react";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await WishlistService.getWishlist();
      setWishlist(data);
    } catch (e) {
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await WishlistService.removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => item.productId !== productId));
    } catch (e) {
      alert("Failed to remove from wishlist");
    }
  };

  if (loading) return <Loader size="lg" />;
  if (error) return <div className="text-red-500">{error}<pre className='text-xs mt-2'>{JSON.stringify(wishlist, null, 2)}</pre></div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-pink-600 flex items-center gap-2">
        <SolidHeart className="text-pink-600" /> My Wishlist
      </h2>
      {wishlist.length === 0 ? (
        <div className="text-gray-500">Your wishlist is empty.<pre className='text-xs mt-2'>{JSON.stringify(wishlist, null, 2)}</pre></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlist.map(item => (
            <Card key={item.id} className="relative group cursor-pointer hover:shadow-lg transition-shadow">
              <div onClick={() => navigate(`/products/${item.productId}`)}>
                <img
                  src={item.productImageUrl || '/assets/no-image.jpg'}
                  alt={item.productName}
                  className="h-40 w-full object-cover rounded-t-lg"
                  onError={e => { e.target.src = '/assets/no-image.jpg'; }}
                />
                <CardHeader>
                  <CardTitle>{item.productName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2">{item.productDescription}</p>
                  <p className="font-bold text-lg text-blue-700">₹{item.productPricePerDay}/day</p>
                </CardContent>
              </div>
              <button
                className="absolute top-3 right-3 z-10 p-2 rounded-full shadow-md bg-white hover:bg-pink-100 transition-all text-pink-600"
                onClick={e => { e.stopPropagation(); handleRemove(item.productId); }}
                title="Remove from wishlist"
              >
                <SolidHeart className="h-6 w-6" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 