import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

// Mock the auth context (from AuthContextUtils)
vi.mock('../auth/AuthContextUtils', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
  }),
  AuthContext: { Provider: ({ children }) => children },
}))

// Mock the cart context (from CartContextUtils)
vi.mock('../context/CartContextUtils', () => ({
  useCart: () => ({
    cart: { items: [] },
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    clearCart: vi.fn(),
  }),
  CartContext: { Provider: ({ children }) => children },
}))

const AppWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    expect(document.body).toBeInTheDocument()
  })
})
