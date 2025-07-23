import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import RequireAuth from "../auth/RequireAuth";

// Product pages
import Products from "../pages/products/Products";
import ProductForm from "../pages/products/ProductForm";
import ProductDetails from "../pages/ProductDetails";

// Rental pages
import Rentals from "../pages/rentals/Rentals";
import RentalDetails from "../pages/rentals/RentalDetails";
import RentalCreate from "../pages/rentals/RentalCreate";

// User pages
import Profile from "../pages/user/Profile";
import MyRentals from "../pages/user/MyRentals";
import Settings from "../pages/user/Settings";
import AddressBook from "../pages/user/AddressBook";
import AddressForm from "../pages/user/AddressForm";

// Auth pages
import Login from "../auth/Login";
import Register from "../auth/Register";

// Cart and Wishlist pages
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import Wishlist from "../pages/Wishlist";

// Feedback pages
import FeedbackForm from "../pages/feedback/FeedbackForm";
import Feedbacks from "../pages/feedback/Feedbacks";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feedback" element={<FeedbackForm />} />

      {/* Protected Routes - Authentication required */}
      <Route path="/dashboard" element={
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      } />

      <Route path="/cart" element={
        <RequireAuth>
          <Cart />
        </RequireAuth>
      } />

      <Route path="/wishlist" element={
        <RequireAuth>
          <Wishlist />
        </RequireAuth>
      } />

      <Route path="/checkout" element={
        <RequireAuth>
          <Checkout />
        </RequireAuth>
      } />

      <Route path="/rentals" element={
        <RequireAuth>
          <Rentals />
        </RequireAuth>
      } />

      <Route path="/rentals/new" element={
        <RequireAuth>
          <RentalCreate />
        </RequireAuth>
      } />

      <Route path="/rentals/:id" element={
        <RequireAuth>
          <RentalDetails />
        </RequireAuth>
      } />

      <Route path="/user/profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      } />

      <Route path="/user/my-rentals" element={
        <RequireAuth>
          <MyRentals />
        </RequireAuth>
      } />

      <Route path="/user/settings" element={
        <RequireAuth>
          <Settings />
        </RequireAuth>
      } />

      <Route path="/user/addresses" element={
        <RequireAuth>
          <AddressBook />
        </RequireAuth>
      } />

      <Route path="/user/addresses/new" element={
        <RequireAuth>
          <AddressForm />
        </RequireAuth>
      } />

      <Route path="/user/addresses/:id/edit" element={
        <RequireAuth>
          <AddressForm />
        </RequireAuth>
      } />

      {/* Admin Routes - Authentication + Admin role required */}
      <Route path="/admin" element={
        <RequireAuth>
          <AdminDashboard />
        </RequireAuth>
      } />

      <Route path="/products/new" element={
        <RequireAuth>
          <ProductForm />
        </RequireAuth>
      } />

      <Route path="/products/edit/:id" element={
        <RequireAuth>
          <ProductForm />
        </RequireAuth>
      } />

      <Route path="/admin/feedbacks" element={
        <RequireAuth>
          <Feedbacks />
        </RequireAuth>
      } />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;