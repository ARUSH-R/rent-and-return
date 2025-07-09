import React, { createContext, useContext, useReducer, useEffect } from 'react';
import CartService from '../services/CartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CART':
      return { ...state, cart: action.payload, isLoading: false, error: null };
    case 'ADD_ITEM':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...(state.cart?.items || []), action.payload]
        }
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart?.items?.filter(item => item.id !== action.payload) || []
        }
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: { items: [] }
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart?.items?.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ) || []
        }
      };
    default:
      return state;
  }
};

const initialState = {
  cart: { items: [] },
  isLoading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cartData = await CartService.getCart();
      dispatch({ type: 'SET_CART', payload: cartData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cartItem = await CartService.addToCart(productId, quantity);
      dispatch({ type: 'ADD_ITEM', payload: cartItem });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const removeFromCart = async (itemId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await CartService.removeFromCart(itemId);
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await CartService.updateQuantity(itemId, quantity);
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await CartService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const value = {
    cart: state.cart,
    isLoading: state.isLoading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
