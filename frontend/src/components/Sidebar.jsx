import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  ClipboardListIcon,
  ChatBubbleLeftEllipsisIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

/**
 * Sidebar navigation for dashboard
 * - Responsive: collapses on small screens (toggle with hamburger)
 * - Shows/hides admin links based on user role
 * - Highlights active route
 */
const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <HomeIcon className="h-6 w-6" />,
    admin: false,
  },
  {
    label: "Products",
    to: "/products",
    icon: <CubeIcon className="h-6 w-6" />,
    admin: false,
  },
  {
    label: "Rentals",
    to: "/rentals",
    icon: <ClipboardListIcon className="h-6 w-6" />,
    admin: false,
  },
  {
    label: "Cart",
    to: "/cart",
    icon: <ShoppingCartIcon className="h-6 w-6" />,
    admin: false,
  },
  {
    label: "Feedback",
    to: "/feedback",
    icon: <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />,
    admin: false,
  },
  {
    label: "Users",
    to: "/admin/users",
    icon: <UserGroupIcon className="h-6 w-6" />,
    admin: true,
  },
  {
    label: "System",
    to: "/admin/system",
    icon: <Cog6ToothIcon className="h-6 w-6" />,
    admin: true,
  },
  {
    label: "Admin Panel",
    to: "/admin",
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    admin: true,
  },
];

const Sidebar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Hide sidebar on auth pages
  if (
    ["/login", "/register"].includes(location.pathname) ||
    !isAuthenticated
  ) {
    return null;
  }

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const filteredNav = navItems.filter(
    (item) => !item.admin || isAdmin
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed z-30 top-4 left-4 bg-white border border-gray-300 rounded p-1 shadow focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-6 w-6 text-blue-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={
              open
                ? "M6 18L18 6M6 6l12 12" // X
                : "M4 6h16M4 12h16M4 18h16" // Hamburger
            }
          />
        </svg>
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed z-20 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-200 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
        style={{ minHeight: "100vh" }}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <Link to="/" className="text-2xl font-bold text-blue-700 tracking-tight">
              Rentify
            </Link>
          </div>
          <nav className="flex-1 py-6 px-2 space-y-2">
            {filteredNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
                  ${
                    location.pathname.startsWith(item.to)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                onClick={() => setOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg font-medium bg-red-50 text-red-700 hover:bg-red-100 transition"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
      {/* Overlay on mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;