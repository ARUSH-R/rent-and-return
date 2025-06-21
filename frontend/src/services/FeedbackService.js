import api from '../api/api';

const FeedbackService = {
  // Get all feedback (admin)
  getAllFeedbacks: () => api.get('/feedback'),

  // Get feedback for specific product
  getFeedbackByProduct: (productId) => api.get(`/feedback/product/${productId}`),

  // Submit feedback
  submitFeedback: (productId, data) =>
    api.post(`/feedback/${productId}`, data),
};

export default FeedbackService;
