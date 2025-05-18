import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiMenu, FiX, FiSettings, FiPackage } from "react-icons/fi";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
      setIsMobileMenuOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const NavLinks = () => (
    <>
      <Link 
        to="/cart" 
        className="flex items-center gap-2 hover:text-purple-500 transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <FiShoppingCart className="text-xl" />
        <span>Cart</span>
      </Link>

      <Link 
        to="/wishlist" 
        className="flex items-center gap-2 hover:text-purple-500 transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <FiHeart className="text-xl" />
        <span>Wishlist</span>
      </Link>

      {isAuthenticated && (
        <Link 
          to="/orders" 
          className="flex items-center gap-2 hover:text-purple-500 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiPackage className="text-xl" />
          <span>Orders</span>
        </Link>
      )}

      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <Link 
            to="/profile" 
            className="flex items-center gap-2 hover:text-purple-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FiUser className="text-xl" />
            )}
            <span>Profile</span>
          </Link>
          
          {/* Admin Link - Only visible to admin users */}
          {user?.role === "admin" && (
            <Link 
              to="/admin" 
              className="flex items-center gap-2 text-purple-400 hover:text-purple-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiSettings className="text-xl" />
              <span>Admin</span>
            </Link>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <Link 
          to="/login" 
          className="flex items-center gap-2 hover:text-purple-500 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiUser className="text-xl" />
          <span>Login</span>
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-[#121212] text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Echoshop
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-[#1E1E1E] rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <NavLinks />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 