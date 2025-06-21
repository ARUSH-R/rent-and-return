import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";

/**
 * Profile Page
 * - Displays the logged-in user's profile information.
 * - Optionally provides editing or password change functionality.
 */
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">My Profile</h2>
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
        </div>
      )}
    </div>
  );
};

export default Profile;