import { describe, it, expect, afterEach, vi } from 'vitest';
import AdminService from '../AdminService';
import api from '../../api/api';

vi.mock('../../api/api');

describe('AdminService', () => {
  afterEach(() => { vi.clearAllMocks(); });

  it('fetches all users', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1 }] });
    const data = await AdminService.getAllUsers();
    expect(api.get).toHaveBeenCalledWith('/admin/users');
    expect(data).toEqual([{ id: 1 }]);
  });

  it('deletes a user', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const data = await AdminService.deleteUser(2);
    expect(api.delete).toHaveBeenCalledWith('/admin/users/2');
    expect(data).toEqual({ success: true });
  });

  it('fetches dashboard stats', async () => {
    api.get.mockResolvedValue({ data: { users: 10 } });
    const data = await AdminService.getDashboardStats();
    expect(api.get).toHaveBeenCalledWith('/admin/stats');
    expect(data).toEqual({ users: 10 });
  });
}); 