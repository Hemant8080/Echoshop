import React from "react";
import { formatINR, formatUSD } from "../utils/currencyUtils";
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const Cart = () => {
  const {
    getCartItems,
    removeFromCart,
    updateCartItemQuantity,
    getTotalPrice
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const cartItems = getCartItems();
  const calculateTotal = getTotalPrice;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      return;
    }
    navigate('/checkout');
  };

  if (!cartItems) {
    return (
      <div className="min-h-screen bg-[#121212] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item._id}
                  className="bg-[#1a1a1a] rounded-xl p-4 flex gap-4 items-center border border-purple-500/10"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden">
                    <img 
                      src={item.images && item.images[0] && item.images[0].url ? item.images[0].url : ''} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-purple-400 text-lg">{formatINR(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-purple-500/20"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-purple-500/20"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold mb-1">{formatINR(item.price * item.quantity)}</p>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1E1E1E] p-6 rounded-lg h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(calculateTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatINR(calculateTotal() * 0.1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span className="font-semibold text-purple-400">
                    {formatINR(calculateTotal())} 
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors mt-6"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 