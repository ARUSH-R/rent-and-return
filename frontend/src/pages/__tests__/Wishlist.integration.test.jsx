import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Wishlist from '../Wishlist';

vi.mock('../../services/WishlistService', () => ({
  default: {
    getWishlist: vi.fn(),
    removeFromWishlist: vi.fn(),
  },
}));
import WishlistService from '../../services/WishlistService';

const mockWishlist = [
  { id: 1, productId: 101, productName: 'Camera', productImageUrl: '', productDescription: 'A nice camera', productPricePerDay: 100 },
  { id: 2, productId: 102, productName: 'Laptop', productImageUrl: '', productDescription: 'A fast laptop', productPricePerDay: 200 },
];

describe('Wishlist Page Integration', () => {
  beforeEach(() => {
    WishlistService.getWishlist.mockResolvedValue([...mockWishlist]);
    WishlistService.removeFromWishlist.mockResolvedValue({ success: true });
  });

  it('renders wishlist items and allows removing an item', async () => {
    render(<MemoryRouter><Wishlist /></MemoryRouter>);
    // Wait for items to load
    expect(await screen.findByText('Camera')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    // Remove the first item
    const removeButtons = screen.getAllByTitle('Remove from wishlist');
    fireEvent.click(removeButtons[0]);
    // Simulate getWishlist returning only the second item after removal
    WishlistService.getWishlist.mockResolvedValue([mockWishlist[1]]);
    await waitFor(() => expect(screen.queryByText('Camera')).not.toBeInTheDocument());
    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  it('shows empty state when wishlist is empty', async () => {
    WishlistService.getWishlist.mockResolvedValue([]);
    render(<MemoryRouter><Wishlist /></MemoryRouter>);
    expect(await screen.findByText('Your wishlist is empty.')).toBeInTheDocument();
  });
}); 