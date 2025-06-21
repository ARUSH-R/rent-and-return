import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

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

  if (isAuthRoute) {
    // Don't show Navbar/Sidebar on login/register pages
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;