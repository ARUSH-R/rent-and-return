import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

/**
 * MyRentals Page
 * - Displays a list of rentals currently associated with the logged-in user.
 * - User can see status and navigate to rental details.
 */
const MyRentals = () => {
  const [myRentals, setMyRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    // You might need to replace the endpoint with your actual user rentals API route
    fetch("/api/rentals/my")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load your rentals");
        return res.json();
      })
      .then((data) => {
        setMyRentals(Array.isArray(data) ? data : data.rentals || []);
      })
      .catch((err) => setError(err.message || "Failed to fetch your rentals"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-8">My Rentals</h2>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="text-red-600 py-12 text-center">{error}</div>
      ) : myRentals.length === 0 ? (
        <div className="text-gray-500 py-12 text-center">
          You have not rented any items yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {myRentals.map((rental) => (
            <Link
              to={`/rentals/${rental.id}`}
              key={rental.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col"
            >
              <img
                src={rental.image}
                alt={rental.name}
                className="h-40 w-full object-contain border-b rounded-t"
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
                    {rental.isRented ? "Currently Rented" : "Returned"}
                  </span>
                </div>
                {rental.rentedAt && (
                  <div className="mt-1 text-xs text-gray-500">
                    Rented At: {new Date(rental.rentedAt).toLocaleString()}
                  </div>
                )}
                {rental.returnedAt && (
                  <div className="mt-1 text-xs text-gray-500">
                    Returned At: {new Date(rental.returnedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRentals;