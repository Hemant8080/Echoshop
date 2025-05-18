import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiSettings, FiUser, FiShoppingBag } from "react-icons/fi";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Redirect to home if already logged in
    if (isAuthenticated) {
      // Check if user is admin and show appropriate toast
      if (user?.role === "admin") {
        toast.success("You are logged in as an admin");
        toast.success("You can access the admin panel from profile page or using the button below");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginSuccess = await login(formData.email, formData.password);
      if (loginSuccess) {
        // Navigate to home page after successful login
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  const goToAdminPanel = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with logo */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 py-6 px-8 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-white/10 p-3 rounded-full">
                <FiShoppingBag className="text-white text-2xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-purple-200 mt-1">Sign in to access your account</p>
          </div>
          
          {/* Admin Access Notification */}
          {isAuthenticated && user?.role === "admin" && (
            <div className="mx-8 -mt-4 mb-4 bg-purple-900/30 rounded-lg p-4 border border-purple-500/30 shadow-lg">
              <p className="text-purple-300 mb-2 flex items-center gap-2">
                <span className="bg-purple-500 p-1 rounded-full">
                  <FiUser className="text-xs" />
                </span>
                You are logged in as <strong>Admin</strong>
              </p>
              <button
                onClick={goToAdminPanel}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <FiSettings className="text-xl" />
                Go to Admin Panel
              </button>
            </div>
          )}

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-gray-300 text-sm font-medium">Email Address</label>
                <div className="relative mt-1">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-10 py-3 text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm font-medium">Password</label>
                <div className="relative mt-1">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-10 py-3 text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <FiEye className="text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                         text-white py-3 rounded-lg font-medium transition-all
                         transform hover:translate-y-[-2px] active:translate-y-0 
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         shadow-md hover:shadow-lg"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-purple-400 hover:text-purple-300 underline transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
            
            <div className="mt-8 border-t border-gray-700 pt-6">
              <p className="text-xs text-center text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 