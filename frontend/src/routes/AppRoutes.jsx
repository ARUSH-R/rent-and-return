import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";

// Product pages
import Products from "../pages/products/Products";
import ProductForm from "../pages/products/ProductForm";

// Rental pages
import Rentals from "../pages/rentals/Rentals";
import RentalDetails from "../pages/rentals/RentalDetails";

// User pages
import Profile from "../pages/user/Profile";
import MyRentals from "../pages/user/MyRentals";
import Settings from "../pages/user/Settings";

// Auth pages (assumed to exist)
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Feedback (assumed to exist)
import Feedback from "../pages/Feedback";

// Other assumed pages (add as needed)
// import Orders from "../pages/orders/Orders";
// import Cart from "../pages/cart/Cart";

// Admin-only pages (assumed to exist)
// import AdminOrders from "../pages/admin/AdminOrders";
// import AdminUsers from "../pages/admin/AdminUsers";
// import Feedbacks from "../pages/admin/Feedbacks";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Products */}
      <Route path="/products" element={<Products />} />
      <Route path="/products/new" element={<ProductForm />} />
      <Route path="/products/edit/:productId" element={<ProductForm />} />
      {/* You might have a ProductDetails page:
      <Route path="/products/:productId" element={<ProductDetails />} /> */}

      {/* Rentals */}
      <Route path="/rentals" element={<Rentals />} />
      <Route path="/rentals/new" element={<RentalDetails />} /> {/* If adding rental uses RentalDetails, else replace */}
      <Route path="/rentals/edit/:rentalId" element={<RentalDetails />} /> {/* If editing uses RentalDetails, else replace */}
      <Route path="/rentals/:rentalId" element={<RentalDetails />} />

      {/* User */}
      <Route path="/user/profile" element={<Profile />} />
      <Route path="/user/my-rentals" element={<MyRentals />} />
      <Route path="/user/settings" element={<Settings />} />

      {/* Feedback */}
      <Route path="/feedback" element={<Feedback />} />
      {/* <Route path="/feedbacks" element={<Feedbacks />} /> */}

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;