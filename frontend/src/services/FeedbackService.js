import api from "../api/api";

/**
 * FeedbackService provides methods for feedback-related API calls.
 */
const FeedbackService = {
  // Get all feedbacks (for admin or public display)
  getAllFeedbacks: async () => {
    try {
      const response = await api.get("/feedbacks");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
      throw error;
    }
  },

  // Get feedback by ID
  getFeedbackById: async (feedbackId) => {
    try {
      const response = await api.get(`/feedbacks/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch feedback ${feedbackId}:`, error);
      throw error;
    }
  },

  // Submit new feedback
  submitFeedback: async (feedbackData) => {
    try {
      const response = await api.post("/feedbacks", feedbackData);
      return response.data;
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      throw error;
    }
  },

  // Delete feedback (admin)
  deleteFeedback: async (feedbackId) => {
    try {
      const response = await api.delete(`/feedbacks/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete feedback ${feedbackId}:`, error);
      throw error;
    }
  }
};

export default FeedbackService;