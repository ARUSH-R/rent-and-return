import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

/**
 * RentalDetails Page
 * - Shows details for a specific rental item
 * - Allows user to rent/return item, admins can edit/delete
 */
const RentalDetails = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: Replace with actual user/admin role logic
  const isAdmin = window.localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/rentals/${rentalId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load rental details");
        return res.json();
      })
      .then((data) => setRental(data))
      .catch((err) => setError(err.message || "Failed to fetch details"))
      .finally(() => setLoading(false));
  }, [rentalId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this rental?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/rentals/${rentalId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete rental");
      navigate("/rentals");
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRentOrReturn = async () => {
    setActionLoading(true);
    try {
      const endpoint = rental.isRented ? "/api/rentals/return" : "/api/rentals/rent";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rentalId }),
      });
      if (!res.ok) throw new Error("Action failed");
      // Optionally, you can refetch the data here
      const updated = await res.json();
      setRental((r) => ({ ...r, ...updated }));
    } catch (err) {
      setError(err.message || "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-12">
        {error}
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="text-gray-500 text-center py-20">
        Rental item not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">{rental.name}</h2>
      <img
        src={rental.image}
        alt={rental.name}
        className="mb-4 h-60 w-full object-contain rounded border"
      />
      <div className="mb-4 text-gray-700">{rental.description}</div>
      <div className="mb-2">
        <span className="font-semibold text-blue-700">Status: </span>
        <span className={rental.isRented ? "text-red-600" : "text-green-600"}>
          {rental.isRented ? "Currently Rented" : "Available"}
        </span>
      </div>
      <div className="mb-6">
        <span className="font-semibold text-blue-700">Rental Price: </span>
        ₹{rental.price}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button
          className={`flex-1 py-2 rounded font-semibold transition ${
            rental.isRented
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-blue-700 text-white hover:bg-blue-800"
          }`}
          disabled={actionLoading}
          onClick={handleRentOrReturn}
        >
          {actionLoading
            ? "Processing..."
            : rental.isRented
            ? "Return Item"
            : "Rent Item"}
        </button>
        <Link
          to="/rentals"
          className="flex-1 py-2 px-4 text-center border border-blue-700 text-blue-700 rounded font-semibold hover:bg-blue-50 transition"
        >
          Back to Rentals
        </Link>
        {isAdmin && (
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 flex-1">
            <Link
              to={`/rentals/edit/${rental.id}`}
              className="py-2 px-4 bg-blue-100 text-blue-700 rounded font-semibold hover:bg-blue-200 text-center"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="py-2 px-4 bg-red-100 text-red-700 rounded font-semibold hover:bg-red-200 transition"
              disabled={actionLoading}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalDetails;