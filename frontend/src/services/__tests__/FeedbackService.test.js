import { describe, it, expect, afterEach, vi } from 'vitest';
import FeedbackService from '../FeedbackService';
import api from '../../api/api';

vi.mock('../../api/api');

describe('FeedbackService', () => {
  afterEach(() => { vi.clearAllMocks(); });

  it('fetches all feedbacks', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1 }] });
    const data = await FeedbackService.getAllFeedbacks();
    expect(api.get).toHaveBeenCalledWith('/feedbacks');
    expect(data).toEqual([{ id: 1 }]);
  });

  it('fetches feedback by id', async () => {
    api.get.mockResolvedValue({ data: { id: 2 } });
    const data = await FeedbackService.getFeedbackById(2);
    expect(api.get).toHaveBeenCalledWith('/feedbacks/2');
    expect(data).toEqual({ id: 2 });
  });

  it('submits feedback', async () => {
    api.post.mockResolvedValue({ data: { id: 3 } });
    const data = await FeedbackService.submitFeedback({ feedback: 'Great!' });
    expect(api.post).toHaveBeenCalledWith('/feedbacks', { feedback: 'Great!' });
    expect(data).toEqual({ id: 3 });
  });

  it('deletes feedback', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const data = await FeedbackService.deleteFeedback(4);
    expect(api.delete).toHaveBeenCalledWith('/feedbacks/4');
    expect(data).toEqual({ success: true });
  });
}); 