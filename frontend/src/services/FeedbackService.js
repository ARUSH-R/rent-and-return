import api from "../api/api";

/**
 * FeedbackService provides methods for feedback-related API calls.
 */
const FeedbackService = {
  // Get all feedbacks (for admin or public display)
  getAllFeedbacks: async () => {
    const response = await api.get("/feedbacks");
    return response.data;
  },

  // Get feedback by ID
  getFeedbackById: async (feedbackId) => {
    const response = await api.get(`/feedbacks/${feedbackId}`);
    return response.data;
  },

  // Submit new feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post("/feedbacks", feedbackData);
    return response.data;
  },

  // Delete feedback (admin)
  deleteFeedback: async (feedbackId) => {
    const response = await api.delete(`/feedbacks/${feedbackId}`);
    return response.data;
  }
};

export default FeedbackService;