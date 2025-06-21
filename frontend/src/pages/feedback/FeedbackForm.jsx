import React, { useState } from 'react';
import FeedbackService from '../../services/FeedbackService';
import { useNavigate, useParams } from 'react-router-dom';

const FeedbackForm = () => {
  const { productId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      return setError('Please provide a valid rating (1–5 stars).');
    }

    try {
      await FeedbackService.submitFeedback(productId, { rating, comment });
      setSuccess('Thank you for your feedback!');
      setTimeout(() => navigate('/my-rentals'), 1500);
    } catch {
      setError('Failed to submit feedback.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Leave Feedback</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Comment (optional)</label>
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            placeholder="Share your thoughts..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
