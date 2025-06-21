import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { isAdmin } from '../utils/roleUtils';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const baseLink = 'block px-4 py-2 rounded hover:bg-gray-700';
  const activeLink = 'bg-gray-700';

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : ''}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : ''}`
          }
        >
          Products
        </NavLink>

        {isAdmin(user) && (
          <NavLink
            to="/feedbacks"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ''}`
            }
          >
            Feedbacks
          </NavLink>
        )}

        <NavLink
          to="/rentals"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : ''}`
          }
        >
          Rentals
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : ''}`
          }
        >
          Cart
        </NavLink>

        <NavLink
          to="/my-rentals"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : ''}`
          }
        >
          My Rentals
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : ''}`
          }
        >
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
