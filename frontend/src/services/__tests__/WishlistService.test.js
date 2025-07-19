import { describe, it, expect, afterEach, vi } from 'vitest';
import WishlistService from '../WishlistService';
import api from '../../api/api';

vi.mock('../../api/api');

describe('WishlistService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches wishlist items', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, productId: 2 }] });
    const data = await WishlistService.getWishlist();
    expect(api.get).toHaveBeenCalledWith('/v1/wishlist');
    expect(data).toEqual([{ id: 1, productId: 2 }]);
  });

  it('adds a product to wishlist', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    const data = await WishlistService.addToWishlist(5);
    expect(api.post).toHaveBeenCalledWith('/v1/wishlist', { productId: 5 });
    expect(data).toEqual({ success: true });
  });

  it('removes a product from wishlist', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const data = await WishlistService.removeFromWishlist(7);
    expect(api.delete).toHaveBeenCalledWith('/v1/wishlist/7');
    expect(data).toEqual({ success: true });
  });
}); 