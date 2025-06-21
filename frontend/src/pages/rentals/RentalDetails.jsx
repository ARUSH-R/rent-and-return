import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import RentalService from '../../services/RentalService';
import Loader from '../../components/Loader';

const RentalDetails = () => {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    RentalService.getRentalById(id)
      .then((res) => setRental(res.data))
      .catch(() => setError('Failed to load rental.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
  if (!rental) return null;

  const { product, user, startDate, endDate, status } = rental;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Rental Details</h2>

      <div className="space-y-4 text-gray-800">
        <div>
          <span className="font-semibold">Rental ID:</span> {rental.id}
        </div>

        <div>
          <span className="font-semibold">Status:</span>{' '}
          <span
            className={`font-medium ${
              status === 'ACTIVE'
                ? 'text-green-600'
                : status === 'COMPLETED'
                ? 'text-blue-600'
                : 'text-red-500'
            }`}
          >
            {status}
          </span>
        </div>

        <div>
          <span className="font-semibold">Start Date:</span> {startDate}
        </div>

        <div>
          <span className="font-semibold">End Date:</span> {endDate}
        </div>

        <div>
          <span className="font-semibold">Product:</span>{' '}
          {product ? (
            <div className="mt-1 ml-2">
              <div className="font-bold">{product.name}</div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-48 h-32 object-cover mt-1 rounded"
              />
              <p className="text-sm mt-1">{product.description}</p>
              <p className="mt-1 font-semibold">₹{product.price}</p>
            </div>
          ) : (
            'N/A'
          )}
        </div>

        <div>
          <span className="font-semibold">User:</span>{' '}
          {user ? (
            <div className="ml-2 mt-1">
              <p className="text-sm">Name: {user.name}</p>
              <p className="text-sm">Email: {user.email}</p>
            </div>
          ) : (
            'N/A'
          )}
        </div>
      </div>

      <div className="mt-6">
        <Link
          to="/rentals"
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Rentals
        </Link>
      </div>
    </div>
  );
};

export default RentalDetails;
