import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from '../App'

// Mock the auth context
vi.mock('../auth/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
  }),
}))

// Mock the cart context
vi.mock('../context/CartContext', () => ({
  CartProvider: ({ children }) => children,
  useCart: () => ({
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    clearCart: vi.fn(),
  }),
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
