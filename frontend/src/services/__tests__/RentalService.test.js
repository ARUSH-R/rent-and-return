import { describe, it, expect, afterEach, vi } from 'vitest';
import RentalService from '../RentalService';
import api from '../../api/api';

vi.mock('../../api/api');

describe('RentalService', () => {
  afterEach(() => { vi.clearAllMocks(); });

  it('fetches all rentals', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1 }] });
    const data = await RentalService.getAllRentals();
    expect(api.get).toHaveBeenCalledWith('/rentals', { params: {} });
    expect(data).toEqual([{ id: 1 }]);
  });

  it('fetches rental by id', async () => {
    api.get.mockResolvedValue({ data: { id: 2 } });
    const data = await RentalService.getRentalById(2);
    expect(api.get).toHaveBeenCalledWith('/rentals/2');
    expect(data).toEqual({ id: 2 });
  });

  it('creates a rental', async () => {
    api.post.mockResolvedValue({ data: { id: 3 } });
    const data = await RentalService.createRental({ productId: 1 });
    expect(api.post).toHaveBeenCalledWith('/rentals', { productId: 1 });
    expect(data).toEqual({ id: 3 });
  });

  it('updates a rental', async () => {
    api.put.mockResolvedValue({ data: { id: 4, status: 'returned' } });
    const data = await RentalService.updateRental(4, { status: 'returned' });
    expect(api.put).toHaveBeenCalledWith('/rentals/4', { status: 'returned' });
    expect(data).toEqual({ id: 4, status: 'returned' });
  });

  it('deletes a rental', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const data = await RentalService.deleteRental(5);
    expect(api.delete).toHaveBeenCalledWith('/rentals/5');
    expect(data).toEqual({ success: true });
  });
}); 