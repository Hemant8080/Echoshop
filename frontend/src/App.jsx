import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Products from './components/Products';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Wishlist from './components/Wishlist';
import Profile from './components/Profile';
import useAuthStore from './store/authStore';
import ProductDetail from './components/ProductDetail';
import AdminPanel from './components/AdminPanel';
import Checkout from './components/Checkout';
import { useEffect, useState } from 'react';
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import OrderSuccess from "./components/OrderSuccess";
import Orders from "./components/Orders";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, getUserProfile, checkTokenValidity } = useAuthStore();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          // First check if token is valid
          const isValid = checkTokenValidity();
          
          if (isValid) {
            // If token exists and is valid, try to get the user profile
            const profileSuccess = await getUserProfile();
            if (!profileSuccess) {
              navigate('/login');
            }
          } else {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [isAuthenticated, navigate, getUserProfile, checkTokenValidity]);

  if (loading || isChecking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};


// Admin Protected Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuthStore();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Layout Component with Navbar and Footer
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Auth Routes - No Navbar/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Routes - With Navbar/Footer */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <Products />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Layout>
                <Cart />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Layout>
                <Wishlist />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Layout>
                <Checkout />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about-us"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
