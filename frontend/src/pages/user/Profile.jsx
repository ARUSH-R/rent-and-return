import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import WishlistService from '../../services/WishlistService';
import { Link } from 'react-router-dom';

/**
 * Profile Page
 * - Displays the logged-in user's profile information.
 * - Optionally provides editing or password change functionality.
 */
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    // Replace '/api/user/profile' with your actual user profile API endpoint
    fetch("/api/user/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message || "Failed to fetch profile"))
      .finally(() => setLoading(false));

    // Fetch wishlist
    const fetchWishlist = async () => {
      setWishlistLoading(true);
      try {
        const data = await WishlistService.getWishlist();
        setWishlist(data);
      } catch (e) {
        setWishlist([]);
      } finally {
        setWishlistLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="text-red-600 py-8 text-center">{error}</div>
      ) : !profile ? (
        <div className="text-gray-500 py-12 text-center">
          Unable to load profile information.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
              {profile.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="font-semibold text-xl text-blue-700">{profile.name}</div>
              <div className="text-gray-600">{profile.email}</div>
            </div>
          </div>
          <div>
            <span className="font-semibold text-blue-700">Joined:</span>{" "}
            {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
          </div>
          {/* Optional: Add edit profile or change password functionality here */}
          {/* <button className="mt-4 bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition">
            Edit Profile
          </button> */}
          <div className="mt-6 flex gap-4">
            <Link to="/profile/addresses" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Manage Addresses</Link>
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Wishlist</h3>
              <Link to="/wishlist" className="text-blue-600 hover:underline text-sm">View All</Link>
            </div>
            {wishlistLoading ? (
              <div>Loading wishlist...</div>
            ) : wishlist.length === 0 ? (
              <div className="text-gray-500">Your wishlist is empty.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {wishlist.slice(0, 3).map(item => (
                  <li key={item.id} className="py-2 flex items-center gap-3">
                    <img src={item.productImageUrl || '/assets/no-image.jpg'} alt="" className="w-10 h-10 object-cover rounded" />
                    <span>{item.productName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;