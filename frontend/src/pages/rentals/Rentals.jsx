import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

/**
 * Rentals Page
 * - Displays a list of rental items available.
 * - Admins can add/edit rentals.
 */
const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // TODO: Replace with actual user/admin role logic
  const isAdmin = window.localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("/api/rentals")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load rentals");
        return res.json();
      })
      .then((data) => {
        setRentals(Array.isArray(data) ? data : data.rentals || []);
      })
      .catch((err) => setError(err.message || "Failed to fetch rentals"))
      .finally(() => setLoading(false));
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {rentals.map((rental) => (
            <Link
              to={`/rentals/${rental.id}`}
              key={rental.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col"
            >
              <img
                src={rental.image}
                alt={rental.name}
                className="h-48 w-full object-contain border-b rounded-t"
              />
              <div className="flex-1 flex flex-col p-4">
                <div className="font-semibold text-lg text-blue-700 mb-1">
                  {rental.name}
                </div>
                <div className="text-gray-600 flex-1">{rental.description}</div>
                <div className="mt-3 font-bold text-xl text-blue-700">
                  ₹{rental.price}
                </div>
                <div className="mt-2 text-sm">
                  Status:{" "}
                  <span className={rental.isRented ? "text-red-600" : "text-green-600"}>
                    {rental.isRented ? "Currently Rented" : "Available"}
                  </span>
                </div>
                {isAdmin && (
                  <Link
                    to={`/rentals/edit/${rental.id}`}
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

export default Rentals;