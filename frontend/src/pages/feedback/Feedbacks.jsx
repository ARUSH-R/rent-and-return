import React, { useEffect, useState } from 'react';
import FeedbackService from '../../services/FeedbackService';
import Loader from '../../components/Loader';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    FeedbackService.getAllFeedbacks()
      .then((res) => setFeedbacks(res.data))
      .catch(() => setError('Failed to load feedbacks.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Feedbacks</h2>

      {feedbacks.length === 0 ? (
        <p className="text-gray-500 text-center">No feedbacks available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Product</th>
                <th className="text-left px-4 py-2">User</th>
                <th className="text-left px-4 py-2">Rating</th>
                <th className="text-left px-4 py-2">Comment</th>
                <th className="text-left px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb) => (
                <tr key={fb.id} className="border-t">
                  <td className="px-4 py-2">{fb.product?.name || 'N/A'}</td>
                  <td className="px-4 py-2">{fb.user?.email || 'N/A'}</td>
                  <td className="px-4 py-2">{'⭐'.repeat(fb.rating)}</td>
                  <td className="px-4 py-2">{fb.comment}</td>
                  <td className="px-4 py-2">
                    {new Date(fb.createdAt).toLocaleDateString()}
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

export default Feedbacks;
