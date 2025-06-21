import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";

/**
 * Feedbacks Page
 * - Displays a list of submitted feedback entries.
 * - Intended for admin/moderator review.
 */
const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError("");
      try {
        // Replace '/api/feedback' with your actual feedback fetch endpoint
        const res = await fetch("/api/feedback");
        if (!res.ok) throw new Error("Failed to load feedbacks");
        const data = await res.json();
        setFeedbacks(Array.isArray(data) ? data : data.feedbacks || []);
      } catch (err) {
        setError(err.message || "Failed to fetch feedbacks");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">All Feedbacks</h2>
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
  );
};

export default Feedbacks;