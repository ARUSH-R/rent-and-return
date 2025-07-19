import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./context/CartContext";
import RequireAuth from "./auth/RequireAuth";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";

const PrivateRoute = RequireAuth;
const AdminRoute = (props) => <RequireAuth {...props} admin={true} />;

// Pages
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/user/Profile";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Products from "./pages/products/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Rentals from "./pages/rentals/Rentals";
import RentalCreate from "./pages/rentals/RentalCreate";
import Feedback from "./pages/feedback/Feedbacks";
import Wishlist from "./pages/Wishlist";
import AddressBook from "./pages/user/AddressBook";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/rentals"
            element={
              <PrivateRoute>
                <Rentals />
              </PrivateRoute>
            }
          />
          <Route
            path="/rental/create"
            element={
              <PrivateRoute>
                <RentalCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route path="/profile/addresses" element={<PrivateRoute><AddressBook /></PrivateRoute>} />

          {/* Products */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* Wishlist */}
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;