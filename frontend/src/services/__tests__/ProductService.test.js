import { describe, it, expect, afterEach, vi } from 'vitest';
import ProductService from '../ProductService';
import api from '../../api/api';

vi.mock('../../api/api');

describe('ProductService', () => {
  afterEach(() => { vi.clearAllMocks(); });

  it('fetches all products', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1 }] });
    const data = await ProductService.getAllProducts();
    expect(api.get).toHaveBeenCalledWith('/products', { params: {} });
    expect(data).toEqual([{ id: 1 }]);
  });

  it('fetches product by id', async () => {
    api.get.mockResolvedValue({ data: { id: 2 } });
    const data = await ProductService.getProductById(2);
    expect(api.get).toHaveBeenCalledWith('/products/2');
    expect(data).toEqual({ id: 2 });
  });

  it('creates a product', async () => {
    api.post.mockResolvedValue({ data: { id: 3 } });
    const data = await ProductService.createProduct({ name: 'Test' });
    expect(api.post).toHaveBeenCalledWith('/products', { name: 'Test' });
    expect(data).toEqual({ id: 3 });
  });

  it('updates a product', async () => {
    api.put.mockResolvedValue({ data: { id: 4, name: 'Updated' } });
    const data = await ProductService.updateProduct(4, { name: 'Updated' });
    expect(api.put).toHaveBeenCalledWith('/products/4', { name: 'Updated' });
    expect(data).toEqual({ id: 4, name: 'Updated' });
  });

  it('deletes a product', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const data = await ProductService.deleteProduct(5);
    expect(api.delete).toHaveBeenCalledWith('/products/5');
    expect(data).toEqual({ success: true });
  });
}); 