import { useState, useEffect } from "react";
import { formatINR, formatUSD } from "../utils/currencyUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const countryNameToCode = {
  India: "IN",
  "United States": "US",
  // Add more as needed
};
function getCountryCode(name) {
  return countryNameToCode[name] || name;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ stripeApiKey, stripePromise }) {
  const navigate = useNavigate();
  const { getCartItems, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, loading: authLoading, getUserProfile } = useAuthStore();
  const cartItems = getCartItems();
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    phoneNo: "",
  });
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!isAuthenticated) {
      const token = localStorage.getItem("token");
      if (token) {
        getUserProfile();
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, navigate, getUserProfile]);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }
  }, [cartItems, navigate]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateOrderTotal = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.1; // 10% tax
    const shipping = 5.99; // Fixed shipping cost
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { subtotal, tax, shipping, total } = calculateOrderTotal();
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images && item.images[0] && item.images[0].url ? item.images[0].url : "",
      }));

      // Process payment with Stripe
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/process`,
        { amount: Math.round(total * 100) }, // Convert to cents
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (!stripe || !elements) {
        toast.error("Stripe has not loaded yet.");
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Test User",
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: getCountryCode(shippingInfo.country),
              postal_code: shippingInfo.pinCode,
            },
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        const orderData = {
          shippingInfo,
          orderItems,
          itemsPrice: subtotal,
          taxPrice: tax,
          shippingPrice: shipping,
          totalPrice: total,
          paymentInfo: {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          },
        };

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL
}/api/v1/order/new`,
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        toast.success("Order placed successfully!");
        clearCart();
        navigate("/order-success");
      }
    } catch (error) {
      toast.error("Error placing order");
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax, shipping, total } = calculateOrderTotal();

  return (
    <div className="min-h-screen bg-black py-12 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Order Summary */}
        <div className="bg-gradient-to-br from-[#232136] to-[#3b375a] rounded-2xl shadow-2xl p-8 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-[#a78bfa]">Order Summary</h2>
          <div className="space-y-6 flex-1">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 border-b border-[#444] pb-4 last:border-b-0 last:pb-0">
                <img
                  src={item.images && item.images[0] && item.images[0].url ? item.images[0].url : ''}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                  <p className="text-gray-300">Quantity: <span className="font-medium">{item.quantity}</span></p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#a78bfa] text-lg">{formatINR(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2 text-base">
            <div className="flex justify-between text-gray-200">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-200">
              <span>Tax (10%)</span>
              <span>{formatINR(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-200">
              <span>Shipping</span>
              <span>{formatINR(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#444] text-white">
              <span>Total</span>
              <span className="text-[#a78bfa]">{formatINR(total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-gradient-to-br from-[#232136] to-[#3b375a] rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-[#a78bfa]">Shipping Information</h2>
          <form onSubmit={handleSubmitOrder} className="space-y-5">
            <div>
              <label className="block text-gray-200 mb-1 font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                required
                className="w-full bg-[#181825] border border-[#444] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#a78bfa] transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-200 mb-1 font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#181825] border border-[#444] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#a78bfa] transition"
                />
              </div>
              <div>
                <label className="block text-gray-200 mb-1 font-medium">State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#181825] border border-[#444] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#a78bfa] transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-200 mb-1 font-medium">Country</label>
                <input
                  type="text"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#181825] border border-[#444] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#a78bfa] transition"
                />
              </div>
              <div>
                <label className="block text-gray-200 mb-1 font-medium">PIN Code</label>
                <input
                  type="number"
                  name="pinCode"
                  value={shippingInfo.pinCode}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#181825] border border-[#444] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#a78bfa] transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-200 mb-1 font-medium">Phone Number</label>
              <input
                type="number"
                name="phoneNo"
                value={shippingInfo.phoneNo}
                onChange={handleInputChange}
                required
                className="w-full bg-[#181825] border border-[#444] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#a78bfa] transition"
              />
            </div>
            <div>
              <label className="block text-gray-200 mb-1 font-medium">Card Details</label>
              <div className="bg-white rounded-lg p-2 mb-2">
                <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
              </div>
             
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#a78bfa] hover:bg-[#7c3aed] text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-md"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [stripePromiseState, setStripePromiseState] = useState(stripePromise);

  useEffect(() => {
    const getStripeApiKey = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL
}/api/v1/stripeapikey`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setStripeApiKey(data.stripeApiKey);
        setStripePromiseState(loadStripe(data.stripeApiKey));
      } catch (error) {
        // ignore
      }
    };
    getStripeApiKey();
  }, []);

  return (
    <Elements stripe={stripePromiseState}>
      <CheckoutForm stripeApiKey={stripeApiKey} stripePromise={stripePromiseState} />
    </Elements>
  );
}
