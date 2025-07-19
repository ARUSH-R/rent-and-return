import { describe, it, expect, afterEach, vi } from 'vitest';
import AuthService from '../AuthService';
import api from '../../api/api';

vi.mock('../../api/api');

describe('AuthService', () => {
  afterEach(() => { vi.clearAllMocks(); });

  it('logs in a user', async () => {
    api.post.mockResolvedValue({ data: { token: 'abc' } });
    const data = await AuthService.login({ identifier: 'user', password: 'pass' });
    expect(api.post).toHaveBeenCalledWith('/auth/login', { identifier: 'user', password: 'pass' });
    expect(data).toEqual({ token: 'abc' });
  });

  it('registers a user', async () => {
    api.post.mockResolvedValue({ data: { token: 'xyz' } });
    const data = await AuthService.register({ name: 'User', email: 'a@b.com', password: 'pass' });
    expect(api.post).toHaveBeenCalledWith('/auth/register', { name: 'User', email: 'a@b.com', password: 'pass' });
    expect(data).toEqual({ token: 'xyz' });
  });
}); 