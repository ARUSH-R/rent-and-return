import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

/**
 * FeedbackForm Page
 * - Allows users to submit feedback or suggestions.
 * - Shows loading and success/error messages.
 */
const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Replace with your API endpoint or context action
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setSuccessMsg("Thank you for your feedback!");
      setFeedback("");
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (error) {
      setErrorMsg(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Feedback</h2>
      <p className="mb-6 text-gray-600">
        We appreciate your feedback and suggestions to improve our service!
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full min-h-[120px] p-3 border border-gray-300 rounded focus:outline-blue-400 resize-y"
          placeholder="Enter your feedback or suggestions..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          disabled={submitting}
        />
        {errorMsg && (
          <div className="text-red-600 text-sm mt-2">{errorMsg}</div>
        )}
        {successMsg && (
          <div className="text-green-700 text-sm mt-2">{successMsg}</div>
        )}
        <button
          type="submit"
          className="mt-4 bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition flex items-center gap-2 disabled:opacity-60"
          disabled={submitting || !feedback.trim()}
        >
          {submitting && <Loader size="sm" />}
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;