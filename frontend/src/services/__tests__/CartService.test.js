import { describe, it, expect, afterEach, vi } from 'vitest';
import CartService from '../CartService';
import api from '../../api/api';

vi.mock('../../api/api');

describe('CartService', () => {
  afterEach(() => { vi.clearAllMocks(); });

  it('fetches cart items', async () => {
    api.get.mockResolvedValue({ data: { items: [{ id: 1 }] } });
    const data = await CartService.getCart();
    expect(api.get).toHaveBeenCalledWith('/cart');
    expect(data).toEqual({ items: [{ id: 1 }] });
  });

  it('adds item to cart', async () => {
    api.post.mockResolvedValue({ data: { id: 2 } });
    const data = await CartService.addToCart(2, 3);
    expect(api.post).toHaveBeenCalledWith('/cart', { productId: 2, quantity: 3 });
    expect(data).toEqual({ id: 2 });
  });

  it('updates quantity', async () => {
    api.put.mockResolvedValue({ data: { id: 1, quantity: 5 } });
    const data = await CartService.updateQuantity(1, 5);
    expect(api.put).toHaveBeenCalledWith('/cart/1', { quantity: 5 });
    expect(data).toEqual({ id: 1, quantity: 5 });
  });

  it('removes item from cart', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const data = await CartService.removeFromCart(4);
    expect(api.delete).toHaveBeenCalledWith('/cart/4');
    expect(data).toEqual({ success: true });
  });

  it('clears the cart', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const data = await CartService.clearCart();
    expect(api.delete).toHaveBeenCalledWith('/cart');
    expect(data).toEqual({ success: true });
  });
}); 