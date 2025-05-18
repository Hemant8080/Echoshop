import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiClock, FiCheck, FiX, FiChevronDown, FiChevronUp, FiDownload, FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { formatINR, formatUSD } from "../utils/currencyUtils";
import { downloadInvoice } from "../utils/invoiceUtils";

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-blue-500/20 text-blue-400";
      case "shipped":
        return "bg-yellow-500/20 text-yellow-400";
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

const Orders = () => {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL
}/api/v1/orders/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        // Sort orders by date (newest first)
        const sortedOrders = [...(data.orders || [])].sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setOrders(sortedOrders);
      } catch (error) {
        toast.error("Error fetching orders");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <FiClock className="text-blue-400" />;
      case "shipped":
        return <FiPackage className="text-yellow-400" />;
      case "delivered":
        return <FiCheck className="text-green-400" />;
      case "cancelled":
        return <FiX className="text-red-400" />;
      default:
        return <FiClock className="text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancelLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL
}/api/v1/order/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Update the order status in the UI
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: "Cancelled" } 
            : order
        )
      );

      toast.success("Order cancelled successfully");
      setCancellingOrder(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error cancelling order";
      toast.error(errorMessage);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#121212] text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#121212] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiPackage className="text-5xl text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
              <p className="text-gray-400 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                to="/products"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-purple-500/10"
                >
                  {/* Order Header */}
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#232136] rounded-full">
                        {getOrderStatusIcon(order.orderStatus)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Order ID</p>
                        <p className="font-mono text-purple-300">{order._id}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end">
                      <OrderStatusBadge status={order.orderStatus} />
                      <p className="text-lg font-semibold mt-2 text-purple-400">
                        {formatINR(order.totalPrice)}
                      </p>
                    </div>

                    <div className="text-gray-400">
                      {expandedOrder === order._id ? (
                        <FiChevronUp className="text-xl" />
                      ) : (
                        <FiChevronDown className="text-xl" />
                      )}
                    </div>
                  </div>

                  {/* Order Details (Expanded) */}
                  {expandedOrder === order._id && (
                    <div className="border-t border-gray-800 p-6">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                        <div className="space-y-4">
                          {order.orderItems.map((item) => (
                            <div key={item._id} className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-400">
                                  Qty: {item.quantity} × {formatINR(item.price)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-purple-400">
                                  {formatINR(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                          <div className="bg-[#232136] p-4 rounded-lg">
                            <p>{order.shippingInfo.address}</p>
                            <p>
                              {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.pinCode}
                            </p>
                            <p>{order.shippingInfo.country}</p>
                            <p className="mt-2">Phone: {order.shippingInfo.phoneNo}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">Payment Info</h3>
                          <div className="bg-[#232136] p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                              <span>Subtotal:</span>
                              <span>{formatINR(order.itemsPrice)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Tax:</span>
                              <span>{formatINR(order.taxPrice)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Shipping:</span>
                              <span>{formatINR(order.shippingPrice)}</span>
                            </div>
                            <div className="flex justify-between font-bold pt-2 border-t border-gray-700">
                              <span>Total:</span>
                              <span className="text-purple-400">{formatINR(order.totalPrice)}</span>
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-700">
                              <p className="flex justify-between">
                                <span>Payment Status:</span>
                                <span className={order.paymentInfo.status === "succeeded" ? "text-green-400" : "text-yellow-400"}>
                                  {order.paymentInfo.status === "succeeded" ? "Paid" : "Pending"}
                                </span>
                              </p>
                              <p className="text-sm text-gray-400 mt-1">
                                Payment ID: {order.paymentInfo.id}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-4">
                        {order.orderStatus === "Processing" && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCancellingOrder(order._id);
                              setShowCancelModal(true);
                            }}
                            className="flex items-center gap-2 bg-[#3a2a45] hover:bg-[#4a3a55] text-white py-2 px-4 rounded-lg transition-colors"
                            disabled={cancelLoading}
                          >
                            <FiX />
                            Cancel Order
                          </button>
                        )}
                        {order.orderStatus === "Delivered" && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadInvoice(order);
                            }}
                            className="flex items-center gap-2 bg-[#232136] hover:bg-[#2d2a45] text-white py-2 px-4 rounded-lg transition-colors"
                          >
                            <FiDownload />
                            Download Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <FiAlertTriangle className="text-2xl" />
              <h3 className="text-xl font-semibold">Cancel Order</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone, and a refund will be processed to your original payment method.
            </p>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancellingOrder(null);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                disabled={cancelLoading}
              >
                No, Keep Order
              </button>
              
              <button
                onClick={() => {
                  handleCancelOrder(cancellingOrder);
                  setShowCancelModal(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Cancelling...
                  </>
                ) : (
                  <>Yes, Cancel Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
