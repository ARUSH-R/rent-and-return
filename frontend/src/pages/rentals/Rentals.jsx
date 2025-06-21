import React, { useEffect, useState } from 'react';
import RentalService from '../../services/RentalService';
import { useAuth } from '../../auth/useAuth';
import { isAdmin } from '../../utils/roleUtils';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';

const Rentals = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = isAdmin(user)
          ? await RentalService.getAllRentals()
          : await RentalService.getMyRentals();
        setRentals(res.data);
      } catch (err) {
        setError('Failed to fetch rentals.');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [user]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {isAdmin(user) ? 'All Rentals' : 'My Rentals'}
      </h2>

      {rentals.length === 0 ? (
        <p className="text-gray-500 text-center">No rentals found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Rental ID</th>
                <th className="text-left px-4 py-2">Product</th>
                <th className="text-left px-4 py-2">User</th>
                <th className="text-left px-4 py-2">Start</th>
                <th className="text-left px-4 py-2">End</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id} className="border-t">
                  <td className="px-4 py-2">{rental.id}</td>
                  <td className="px-4 py-2">{rental.product?.name || 'N/A'}</td>
                  <td className="px-4 py-2">{rental.user?.email || 'N/A'}</td>
                  <td className="px-4 py-2">{rental.startDate}</td>
                  <td className="px-4 py-2">{rental.endDate}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-sm font-medium ${
                        rental.status === 'ACTIVE'
                          ? 'text-green-600'
                          : rental.status === 'COMPLETED'
                          ? 'text-blue-600'
                          : 'text-red-500'
                      }`}
                    >
                      {rental.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/rentals/${rental.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Rentals;
