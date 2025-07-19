import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * Layout component
 * - Wraps application content with Navbar and Sidebar
 * - Responsive: Sidebar collapses on mobile
 * - Hides Sidebar/Navbar for auth pages (login/register)
 */
const AUTH_ROUTES = ["/login", "/register"];

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);
  const isHomePage = location.pathname === "/";
  const isProductsPage = location.pathname.startsWith('/products');

  if (isAuthRoute) {
    // Don't show Navbar/Sidebar on login/register pages
    return <>{children}</>;
  }

  if (isHomePage) {
    // For home page, only show navbar, no sidebar and no padding
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  if (isProductsPage) {
    // Only show top bar and main content; sidebar is handled by products page
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
        <main className="flex-1 p-0">
          {children}
        </main>
      </div>
    );
  }

  // All other pages: only top bar
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;