import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import api from "../../api/api";
import { useAuth } from "../../auth/AuthContext";

/**
 * Rentals Page
 * - Displays a list of user's current and past rentals.
 * - Shows rental history and status.
 */
const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();

  useEffect(() => {
    setLoading(true);
    setError("");
    
    // For now, provide sample rental data since backend endpoint may not exist
    setTimeout(() => {
      const sampleRentals = [
        {
          id: 1,
          productName: "MacBook Pro 13\"",
          productImage: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&crop=center",
          rentalDate: "2025-01-10",
          returnDate: "2025-01-15",
          status: "Active",
          pricePerDay: 50.00,
          totalDays: 5,
          totalCost: 250.00
        },
        {
          id: 2,
          productName: "Digital Camera",
          productImage: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop&crop=center",
          rentalDate: "2025-01-05",
          returnDate: "2025-01-08",
          status: "Completed",
          pricePerDay: 35.00,
          totalDays: 3,
          totalCost: 105.00
        }
      ];
      setRentals(sampleRentals);
      setLoading(false);
    }, 1000);
    
    // Uncomment when backend endpoint is ready:
    // api.get("/rentals")
    //   .then((res) => {
    //     const data = res.data;
    //     setRentals(Array.isArray(data) ? data : data.rentals || []);
    //   })
    //   .catch((err) => setError(err.message || "Failed to fetch rentals"))
    //   .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-blue-700">Rentals</h2>
        {isAdmin && (
          <Link
            to="/rentals/new"
            className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition"
          >
            Add Rental
          </Link>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="text-red-600 py-12 text-center">{error}</div>
      ) : rentals.length === 0 ? (
        <div className="text-gray-500 py-12 text-center">
          No rentals available.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-lg font-semibold text-gray-800 mb-4">
            Your Rental History
          </div>
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <div className="flex gap-4">
                <img
                  src={rental.productImage}
                  alt={rental.productName}
                  className="h-24 w-24 object-cover rounded border"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-lg text-blue-700">
                      {rental.productName}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      rental.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rental.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Rental Date:</span>
                      <br />{new Date(rental.rentalDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Return Date:</span>
                      <br />{new Date(rental.returnDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <br />{rental.totalDays} days
                    </div>
                    <div>
                      <span className="font-medium">Total Cost:</span>
                      <br /><span className="text-blue-700 font-bold">₹{rental.totalCost}</span>
                    </div>
                  </div>
                  {rental.status === 'Active' && (
                    <div className="mt-4 flex gap-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
                        Extend Rental
                      </button>
                      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition">
                        Return Item
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rentals;