import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContextUtils";
import Button from "./ui/Button";
import { User, LogOut, ShoppingCart, Package, Settings, Heart, Home } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-blue-700 tracking-tight">
          RentReturn
        </Link>
        
        {/* Public Navigation - Always visible */}
        <div className="hidden md:flex gap-6 ml-8 text-gray-700 font-medium">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-blue-700 transition"
          >
            <Home size={16} />
            Home
          </Link>
          <Link 
            to="/products" 
            className="flex items-center gap-2 hover:text-blue-700 transition"
          >
            <Package size={16} />
            Products
          </Link>
          <Link 
            to="/feedback" 
            className="hover:text-blue-700 transition"
          >
            Feedback
          </Link>
        </div>

        {/* Protected Navigation - Only for authenticated users */}
        {isAuthenticated && (
          <div className="hidden md:flex gap-6 ml-4 text-gray-700 font-medium border-l border-gray-200 pl-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 hover:text-blue-700 transition"
            >
              <Settings size={16} />
              Dashboard
            </Link>
            <Link 
              to="/rentals" 
              className="flex items-center gap-2 hover:text-blue-700 transition"
            >
              <Package size={16} />
              My Rentals
            </Link>
            <Link 
              to="/cart" 
              className="flex items-center gap-2 hover:text-blue-700 transition"
            >
              <ShoppingCart size={16} />
              Cart
            </Link>
            <Link 
              to="/wishlist" 
              className="flex items-center gap-2 hover:text-pink-600 transition"
            >
              <Heart size={16} />
              Wishlist
            </Link>
            {user?.role?.toLowerCase() === "admin" && (
              <Link 
                to="/admin" 
                className="hover:text-blue-700 transition font-semibold"
              >
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Button variant="ghost" asChild>
              <Link to="/login">
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link to="/register">
                Register
              </Link>
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User size={20} className="text-gray-600" />
              <span className="hidden md:inline text-gray-700 font-medium">
                Hi, {user?.username || user?.email}
                {user?.role ? (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold uppercase">
                    {user.role}
                  </span>
                ) : null}
              </span>
            </div>
            <Button variant="danger" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;