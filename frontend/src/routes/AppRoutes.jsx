import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import Products from '../pages/products/Products';
import ProductForm from '../pages/products/ProductForm';
import Rentals from '../pages/rentals/Rentals';
import RentalDetails from '../pages/rentals/RentalDetails';
import Cart from '../pages/cart/Cart';
import Checkout from '../pages/cart/Checkout';
import Feedbacks from '../pages/feedback/Feedbacks';
import FeedbackForm from '../pages/feedback/FeedbackForm';
import Profile from '../pages/user/Profile';
import Settings from '../pages/user/Settings';
import MyRentals from '../pages/user/MyRentals';
import ProtectedRoute from '../auth/ProtectedRoute';
import { useAuth } from '../auth/useAuth';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated Only */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/rentals/:id" element={<RentalDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart/checkout" element={<Checkout />} />
        <Route path="/feedback/:productId" element={<FeedbackForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/my-rentals" element={<MyRentals />} />
      </Route>

      {/* Admin Only */}
      <Route
        path="/products/new"
        element={<ProtectedRoute roles={['ADMIN']}><ProductForm /></ProtectedRoute>}
      />
      <Route
        path="/products/edit/:id"
        element={<ProtectedRoute roles={['ADMIN']}><ProductForm /></ProtectedRoute>}
      />
      <Route
        path="/feedbacks"
        element={<ProtectedRoute roles={['ADMIN']}><Feedbacks /></ProtectedRoute>}
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
