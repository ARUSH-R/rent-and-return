import { describe, it, expect, afterEach, vi } from 'vitest';
import UserService from '../UserService';
import api from '../../api/api';

vi.mock('../../api/api');

describe('UserService', () => {
  afterEach(() => { vi.clearAllMocks(); });

  it('fetches user profile', async () => {
    api.get.mockResolvedValue({ data: { id: 1, name: 'User' } });
    const data = await UserService.getProfile();
    expect(api.get).toHaveBeenCalledWith('/user/profile');
    expect(data).toEqual({ id: 1, name: 'User' });
  });

  it('updates user profile', async () => {
    api.put.mockResolvedValue({ data: { id: 1, name: 'Updated' } });
    const data = await UserService.updateProfile({ name: 'Updated' });
    expect(api.put).toHaveBeenCalledWith('/user/profile', { name: 'Updated' });
    expect(data).toEqual({ id: 1, name: 'Updated' });
  });

  it('fetches user rentals', async () => {
    api.get.mockResolvedValue({ data: [{ id: 2 }] });
    const data = await UserService.getMyRentals();
    expect(api.get).toHaveBeenCalledWith('/user/my-rentals');
    expect(data).toEqual([{ id: 2 }]);
  });

  it('changes password', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    const data = await UserService.changePassword({ old: 'a', new: 'b' });
    expect(api.post).toHaveBeenCalledWith('/user/change-password', { old: 'a', new: 'b' });
    expect(data).toEqual({ success: true });
  });

  it('fetches dashboard summary', async () => {
    api.get.mockResolvedValue({ data: { rentals: 3 } });
    const data = await UserService.getDashboardSummary();
    expect(api.get).toHaveBeenCalledWith('/dashboard/summary');
    expect(data).toEqual({ rentals: 3 });
  });
}); 