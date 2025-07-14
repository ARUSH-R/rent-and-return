import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useAuth } from "../../auth/AuthContext";

/**
 * Feedbacks Page
 * - Allows users to submit feedback.
 * - Shows feedback form and submission history.
 */
const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Load sample feedback data
    setTimeout(() => {
      const sampleFeedbacks = [
        {
          id: 1,
          user: { name: "John Doe", email: "john@example.com" },
          feedback: "Great service! The laptop rental was smooth and the device was in excellent condition.",
          rating: 5,
          createdAt: "2025-01-10T10:30:00Z"
        },
        {
          id: 2,
          user: { name: "Jane Smith", email: "jane@example.com" },
          feedback: "Good experience overall. Would like to see more variety in electronics.",
          rating: 4,
          createdAt: "2025-01-08T14:20:00Z"
        },
        {
          id: 3,
          user: { name: user?.username || "You", email: user?.email || "" },
          feedback: "The platform is user-friendly and the rental process is straightforward.",
          rating: 5,
          createdAt: "2025-01-05T09:15:00Z"
        }
      ];
      setFeedbacks(sampleFeedbacks);
      setLoading(false);
    }, 800);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newFeedback = {
        id: Date.now(),
        user: { name: user?.username || "You", email: user?.email || "" },
        feedback: feedback.trim(),
        rating,
        createdAt: new Date().toISOString()
      };
      
      setFeedbacks([newFeedback, ...feedbacks]);
      setFeedback("");
      setRating(5);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Feedback Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Submit Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
              <option value={4}>⭐⭐⭐⭐ Good</option>
              <option value={3}>⭐⭐⭐ Average</option>
              <option value={2}>⭐⭐ Poor</option>
              <option value={1}>⭐ Terrible</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with RentReturn..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !feedback.trim()}
            className="w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-6 text-blue-700">Recent Feedbacks</h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="text-red-600 py-8 text-center">{error}</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-gray-500 py-12 text-center">
            No feedbacks have been submitted yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {feedbacks.map((fb, idx) => (
              <li key={fb.id || idx} className="py-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                    {fb.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="font-semibold text-blue-700">
                      {fb.user?.name || fb.user?.email || "Anonymous"}
                    </div>
                    <div className="text-gray-600 text-sm mb-1">
                      {fb.createdAt
                        ? new Date(fb.createdAt).toLocaleString()
                        : ""}
                    </div>
                    <div className="text-gray-800">{fb.feedback || fb.text}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;