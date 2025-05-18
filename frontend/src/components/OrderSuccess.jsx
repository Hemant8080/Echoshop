import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiHome } from "react-icons/fi";
import useAuthStore from "../store/authStore";
import Navbar from "./Navbar";
import Footer from "./Footer";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#121212] text-white py-12 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-[#232136] to-[#3b375a] rounded-2xl shadow-2xl p-10 mb-8">
            <div className="flex justify-center mb-6">
              <FiCheckCircle className="text-green-400 text-7xl" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-[#a78bfa]">Order Placed Successfully!</h1>
            
            <p className="text-gray-300 text-lg mb-8">
              Thank you for your purchase. Your order has been received and is being processed.
              You will receive an email confirmation shortly.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link 
                to="/orders" 
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors"
              >
                <FiShoppingBag />
                View My Orders
              </Link>
              
              <Link 
                to="/" 
                className="flex items-center justify-center gap-2 border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white py-3 px-6 rounded-lg transition-colors"
              >
                <FiHome />
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="text-gray-400 text-sm">
            <p>Order confirmation and details have been sent to your email address.</p>
            <p className="mt-2">If you have any questions, please contact our customer support.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;
