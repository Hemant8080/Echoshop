import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBarChart2,
  FiShoppingCart,
  FiDollarSign,
  FiImage,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { formatINR, formatUSD } from "../utils/currencyUtils";
import useProductStore from "../store/productStore";
import useAuthStore from "../store/authStore";
import axios from "axios";
import "../styles/adminTheme.css";

const ProductForm = memo(
  ({
    formData,
    handleInputChange,
    handleImageChange,
    imagePreview,
    loading,
    handleAddProduct,
  }) => (
    <div className="mb-6 p-4 bg-gray-800 dark:bg-gray-200 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            name="name"
            placeholder="Product Name *"
            className="bg-gray-800 p-3 rounded-lg text-white w-full"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="md:col-span-2">
          <textarea
            name="description"
            placeholder="Description *"
            className="bg-gray-800 p-3 rounded-lg text-white w-full"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="price"
            placeholder="Price *"
            className="bg-gray-800 p-3 rounded-lg text-white w-full"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <select
            name="category"
            className="bg-gray-800 p-3 rounded-lg text-white w-full"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category *</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="books">Books</option>
            <option value="sports">Sports</option>
          </select>
        </div>
        <div>
          <input
            type="number"
            name="Stock"
            placeholder="Stock"
            className="bg-gray-800 p-3 rounded-lg text-white w-full"
            value={formData.Stock}
            onChange={handleInputChange}
            min="1"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-400 mb-2">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="bg-gray-800 p-3 rounded-lg text-white w-full"
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {imagePreview.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }));
                    setImagePreview((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleAddProduct}
          disabled={loading}
          className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>
    </div>
  )
);

const ProductManagement = memo(
  ({
    products,
    loading,
    handleDeleteProduct,
    formData,
    handleInputChange,
    handleImageChange,
    imagePreview,
    handleAddProduct,
    handleUpdateProduct,
    editingProduct,
    setEditingProduct,
  }) => (
    <div>
      <ProductForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        imagePreview={imagePreview}
        loading={loading}
        handleAddProduct={handleAddProduct}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-800 dark:bg-gray-200">
            <tr className="text-left border-b border-gray-700 dark:border-gray-300">
              <th className="p-4 whitespace-nowrap">Name</th>
              <th className="p-4 whitespace-nowrap">Price</th>
              <th className="p-4 whitespace-nowrap">Category</th>
              <th className="p-4 whitespace-nowrap">Stock</th>
              <th className="p-4 whitespace-nowrap">Ratings</th>
              <th className="p-4 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-gray-700 dark:border-gray-300"
              >
                <td className="p-4">{product.name}</td>
                <td className="p-4">{formatINR(product.price)}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">{product.Stock}</td>
                <td className="p-4">{product.ratings}</td>
                <td className="p-4">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-500 hover:text-blue-400 dark:text-blue-600 dark:hover:text-blue-500 mr-4"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-500 hover:text-red-400 dark:text-red-600 dark:hover:text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-white dark:text-gray-900">
              Update Product
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name *"
                  className="bg-gray-700 dark:bg-gray-300 p-3 rounded-lg text-white dark:text-gray-900 w-full"
                  value={editingProduct.name || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <textarea
                  name="description"
                  placeholder="Description *"
                  className="bg-gray-700 dark:bg-gray-300 p-3 rounded-lg text-white dark:text-gray-900 w-full"
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  name="price"
                  placeholder="Price *"
                  className="bg-gray-700 dark:bg-gray-300 p-3 rounded-lg text-white dark:text-gray-900 w-full"
                  value={editingProduct.price || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: e.target.value,
                    })
                  }
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <select
                  name="category"
                  className="bg-gray-700 dark:bg-gray-300 p-3 rounded-lg text-white dark:text-gray-900 w-full"
                  value={editingProduct.category || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Category *</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home</option>
                  <option value="books">Books</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  name="Stock"
                  placeholder="Stock"
                  className="bg-gray-700 dark:bg-gray-300 p-3 rounded-lg text-white dark:text-gray-900 w-full"
                  value={editingProduct.Stock || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      Stock: e.target.value,
                    })
                  }
                  min="1"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 dark:text-gray-600 mb-2">
                  Product Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setEditingProduct({ ...editingProduct, images: files });
                  }}
                  className="bg-gray-700 dark:bg-gray-300 p-3 rounded-lg text-white dark:text-gray-900 w-full"
                />
                <div className="flex flex-wrap gap-4 mt-4">
                  {editingProduct.images?.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={
                          typeof image === "string"
                            ? image
                            : image.url || URL.createObjectURL(image)
                        }
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateProduct(editingProduct)}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
);

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Get detailed orders with user information
      const populatedOrders = await Promise.all(
        (data.orders || []).map(async (order) => {
          try {
            // Get user details for each order
            const userId =
              typeof order.user === "object" ? order.user._id : order.user;
            const userResponse = await axios
              .get(
                `${
                  import.meta.env.VITE_BACKEND_URL
                }/api/v1/admin/user/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
                }
              )
              .catch(() => ({ data: { user: { name: "Unknown User" } } }));

            return {
              ...order,
              userName: userResponse.data?.user?.name || "Unknown User",
              userEmail: userResponse.data?.user?.email || "N/A",
            };
          } catch (err) {
            console.error("Error fetching user details:", err);
            return {
              ...order,
              userName: "Unknown User",
              userEmail: "N/A",
            };
          }
        })
      );

      setOrders(populatedOrders || []);

      // Initialize statusMap
      const map = {};
      populatedOrders.forEach((order) => {
        map[order._id] = order.orderStatus;
      });
      setStatusMap(map);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusMap((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/order/${orderId}`,
        {
          status: statusMap[orderId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(`Order status updated to ${statusMap[orderId]}`);

        // Update the order in the local state
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? { ...order, orderStatus: statusMap[orderId] }
              : order
          )
        );

        // Also update the selected order if it's currently being viewed
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({
            ...prev,
            orderStatus: statusMap[orderId],
          }));
        }
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");

      // Revert the status in statusMap
      setStatusMap((prev) => ({
        ...prev,
        [orderId]:
          orders.find((o) => o._id === orderId)?.orderStatus || prev[orderId],
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-2 text-purple-400">
        <FiPackage /> Order Management
      </h2>

      {selectedOrder ? (
        <div className="bg-gray-800 dark:bg-gray-200 p-4 lg:p-6 rounded-lg mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
            <h3 className="text-lg lg:text-xl font-bold text-white dark:text-gray-900">
              Order Details
            </h3>
            <button
              onClick={() => setSelectedOrder(null)}
              className="bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 px-4 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-400"
            >
              Back to Orders
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-purple-300">
                Order Information
              </h4>
              <div className="bg-gray-900 p-4 rounded">
                <p>
                  <span className="text-gray-400">Order ID:</span>{" "}
                  {selectedOrder._id}
                </p>
                <p>
                  <span className="text-gray-400">Date:</span>{" "}
                  {formatDate(selectedOrder.paidAt)}
                </p>
                <p>
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedOrder.orderStatus === "Delivered"
                        ? "bg-green-600/20 text-green-400"
                        : selectedOrder.orderStatus === "Shipped"
                        ? "bg-yellow-600/20 text-yellow-400"
                        : "bg-purple-600/20 text-purple-400"
                    }`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Total:</span>{" "}
                  {formatINR(selectedOrder.totalPrice)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2 text-purple-300">
                Customer Information
              </h4>
              <div className="bg-gray-900 p-4 rounded">
                <p>
                  <span className="text-gray-400">Name:</span>{" "}
                  {selectedOrder.userName ||
                    selectedOrder.user?.name ||
                    "Unknown"}
                </p>
                <p>
                  <span className="text-gray-400">Email:</span>{" "}
                  {selectedOrder.userEmail ||
                    selectedOrder.user?.email ||
                    "N/A"}
                </p>

                <h5 className="text-gray-400 mt-4 mb-2">Shipping Address:</h5>
                <p>{selectedOrder.shippingInfo.address}</p>
                <p>
                  {selectedOrder.shippingInfo.city},{" "}
                  {selectedOrder.shippingInfo.state}
                </p>
                <p>
                  {selectedOrder.shippingInfo.country},{" "}
                  {selectedOrder.shippingInfo.pinCode}
                </p>
                <p>
                  <span className="text-gray-400">Phone:</span>{" "}
                  {selectedOrder.shippingInfo.phoneNo}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2 text-purple-300">
              Order Items
            </h4>
            <div className="bg-gray-900 p-4 rounded">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Product</th>
                    <th className="text-center py-2">Price</th>
                    <th className="text-center py-2">Quantity</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-2 flex items-center">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded mr-3"
                          />
                        )}
                        <span>{item.name}</span>
                      </td>
                      <td className="text-center py-2">
                        {formatINR(item.price)}
                      </td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-right py-2">
                        {formatINR(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <td colSpan="3" className="text-right py-2">
                      Subtotal:
                    </td>
                    <td className="text-right py-2">
                      {formatINR(selectedOrder.itemsPrice)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right py-2">
                      Tax:
                    </td>
                    <td className="text-right py-2">
                      {formatINR(selectedOrder.taxPrice)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right py-2">
                      Shipping:
                    </td>
                    <td className="text-right py-2">
                      {formatINR(selectedOrder.shippingPrice)}
                    </td>
                  </tr>
                  <tr className="font-bold text-purple-300">
                    <td colSpan="3" className="text-right py-2">
                      Total:
                    </td>
                    <td className="text-right py-2">
                      {formatINR(selectedOrder.totalPrice)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center">
              <span className="mr-2">Update Status:</span>
              <select
                value={statusMap[selectedOrder._id]}
                onChange={(e) =>
                  handleStatusChange(selectedOrder._id, e.target.value)
                }
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <button
              onClick={() => handleUpdateStatus(selectedOrder._id)}
              disabled={updatingId === selectedOrder._id}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
            >
              {updatingId === selectedOrder._id ? (
                <FiRefreshCw className="animate-spin" />
              ) : (
                "Update Status"
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="text-white/80">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-white/60">No orders found.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="text-left border-b border-gray-700 dark:border-gray-300">
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-700 dark:border-gray-300"
                  >
                    <td className="px-4 py-2 font-mono text-purple-300">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-4 py-2">{order.userName || "Unknown"}</td>
                    <td className="px-4 py-2">{formatINR(order.totalPrice)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          order.orderStatus === "Processing"
                            ? "bg-yellow-500/20 text-yellow-500 dark:bg-yellow-600/20 dark:text-yellow-600"
                            : order.orderStatus === "Shipped"
                            ? "bg-blue-500/20 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600"
                            : order.orderStatus === "Delivered"
                            ? "bg-green-500/20 text-green-500 dark:bg-green-600/20 dark:text-green-600"
                            : "bg-red-500/20 text-red-500 dark:bg-red-600/20 dark:text-red-600"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatDate(order.paidAt)}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200 min-w-[60px]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order._id)}
                          disabled={updatingId === order._id}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200 min-w-[60px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {updatingId === order._id ? (
                            <FiRefreshCw className="animate-spin h-4 w-4" />
                          ) : (
                            "Update"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("adminPanelTheme");
    return savedTheme === "dark" || savedTheme === null;
  });

  useEffect(() => {
    // Apply theme on mount and when it changes
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("adminPanelTheme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(`Switched to ${!isDarkMode ? "dark" : "light"} mode`);
  };

  return (
    <div className="space-y-4 lg:space-y-8">
      <div className="bg-gray-800 dark:bg-gray-100 rounded-lg p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6 text-white dark:text-gray-900">
          Theme Settings
        </h2>

        <div className="flex items-center justify-between p-4 bg-gray-900 dark:bg-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
                isDarkMode ? "bg-purple-600" : "bg-gray-400"
              }`}
              onClick={toggleTheme}
            >
              <div
                className={`absolute w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  isDarkMode ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </div>
            <span className="text-white dark:text-gray-900">
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 dark:bg-gray-100 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-white dark:text-gray-900">
          General Settings
        </h2>
        <p className="text-gray-400 dark:text-gray-600">
          More settings options will be added here...
        </p>
      </div>
    </div>
  );
};

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch users count
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        // Fetch orders
        const ordersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        // Calculate total revenue from orders
        const totalRevenue = ordersResponse.data.orders.reduce((sum, order) => {
          return sum + (order.totalPrice || 0);
        }, 0);

        setStats({
          totalUsers: usersResponse.data.users.length || 0,
          totalOrders: ordersResponse.data.orders.length || 0,
          totalRevenue: totalRevenue,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard statistics");
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg animate-pulse"
          >
            <div className="h-20 bg-gray-700 dark:bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-500 bg-opacity-20 dark:bg-purple-600 dark:bg-opacity-20">
            <FiShoppingCart className="text-purple-500 dark:text-purple-600 text-2xl" />
          </div>
          <div className="ml-4">
            <p className="text-gray-400 dark:text-gray-600">Total Orders</p>
            <h3 className="text-2xl font-bold text-white dark:text-gray-900">
              {stats.totalOrders.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-500 bg-opacity-20 dark:bg-blue-600 dark:bg-opacity-20">
            <FiDollarSign className="text-blue-500 dark:text-blue-600 text-2xl" />
          </div>
          <div className="ml-4">
            <p className="text-gray-400 dark:text-gray-600">Total Revenue</p>
            <h3 className="text-2xl font-bold text-white dark:text-gray-900">
              $
              {stats.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20">
            <FiUsers className="text-green-500 dark:text-green-600 text-2xl" />
          </div>
          <div className="ml-4">
            <p className="text-gray-400 dark:text-gray-600">Total Users</p>
            <h3 className="text-2xl font-bold text-white dark:text-gray-900">
              {stats.totalUsers.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [editingUser, setEditingUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [realUsers, setRealUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setRealUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser({
      ...userToEdit,
      newRole: userToEdit.role,
    });
  };

  const handleRoleChange = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/user/${
          editingUser._id
        }`,
        {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.newRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the users list with the new role
        setRealUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === editingUser._id ? { ...u, role: editingUser.newRole } : u
          )
        );

        toast.success(`User role updated to ${editingUser.newRole}`);
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        {loadingUsers ? (
          <div className="text-white/80 dark:text-gray-900/80">
            Loading users...
          </div>
        ) : realUsers.length === 0 ? (
          <div className="text-white/60 dark:text-gray-900/60">
            No users found.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700 dark:border-gray-300">
                <th className="p-4">ID</th>
                <th className="p-4">Avatar</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {realUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-700 dark:border-gray-300"
                >
                  <td className="p-4 font-mono text-xs">
                    {user._id.substring(0, 8)}...
                  </td>
                  <td className="p-4">
                    {user.avatar && (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                  </td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-purple-500 bg-opacity-20 text-purple-500 dark:bg-purple-600 dark:bg-opacity-20 dark:text-purple-600"
                          : "bg-blue-500 bg-opacity-20 text-blue-500 dark:bg-blue-600 dark:bg-opacity-20 dark:text-blue-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-500 hover:text-blue-400 dark:text-blue-600 dark:hover:text-blue-500"
                      title="Edit user role"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      className={`text-red-500 hover:text-red-400 dark:text-red-600 dark:hover:text-red-500 ${
                        user.role === "admin"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={user.role === "admin"}
                      title={
                        user.role === "admin"
                          ? "Cannot delete admin users"
                          : "Delete user"
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Role Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-white dark:text-gray-900">
              Edit User Role
            </h3>
            <div className="mb-4">
              <p className="text-gray-400 dark:text-gray-600 mb-2">
                User: {editingUser.name}
              </p>
              <p className="text-gray-400 dark:text-gray-600 mb-4">
                Email: {editingUser.email}
              </p>

              <label className="block text-gray-300 dark:text-gray-700 mb-2">
                Role
              </label>
              <select
                value={editingUser.newRole}
                onChange={(e) =>
                  setEditingUser((prev) => ({
                    ...prev,
                    newRole: e.target.value,
                  }))
                }
                className="w-full bg-gray-700 dark:bg-gray-300 border border-gray-600 dark:border-gray-400 rounded-lg px-4 py-2 text-white dark:text-gray-900 focus:outline-none focus:border-purple-500 dark:focus:border-purple-600"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, getUserProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    Stock: 1,
    images: [],
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const {
    products,
    loading: productLoading,
    fetchProducts,
    createProduct,
    deleteProduct,
    updateProduct,
  } = useProductStore();

  // USER MANAGEMENT STATE AND FUNCTIONS
  const [realUsers, setRealUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL
              }/api/v1/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setRealUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, fetchUsers]);

  const handleDeleteUser = async (userId, userName) => {
    // Don't allow admin to delete themselves
    if (user._id === userId) {
      toast.error("You cannot delete your own admin account");
      return;
    }

    // Show confirmation dialog
    if (
      window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL
}/api/v1/admin/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        toast.success("User deleted successfully");
        // Update the users list
        setRealUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  useEffect(() => {
    // Load products
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = useCallback(async () => {
    try {
      // Validate form data
      if (!formData.name?.trim()) {
        toast.error("Please enter product name");
        return;
      }
      if (!formData.description?.trim()) {
        toast.error("Please enter product description");
        return;
      }
      if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
        toast.error("Please enter valid price");
        return;
      }
      if (!formData.category) {
        toast.error("Please select category");
        return;
      }

      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        Stock: Number(formData.Stock) || 1,
        images: formData.images || [],
      };

      // Log the data being sent
      console.log("Sending product data:", productData);

      await createProduct(productData);

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        Stock: 1,
        images: [],
      });
      setImagePreview([]);
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error adding product");
      }
    }
  }, [formData, createProduct]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);

    // Store the files in formData
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleDeleteProduct = useCallback(
    async (id) => {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },
    [deleteProduct]
  );

  const handleUpdateProduct = useCallback(
    async (productData) => {
      try {
        // Validate form data
        if (!productData.name?.trim()) {
          toast.error("Please enter product name");
          return;
        }
        if (!productData.description?.trim()) {
          toast.error("Please enter product description");
          return;
        }
        if (
          !productData.price ||
          isNaN(productData.price) ||
          productData.price <= 0
        ) {
          toast.error("Please enter valid price");
          return;
        }
        if (!productData.category) {
          toast.error("Please select category");
          return;
        }

        // Prepare product data
        const updatedProductData = {
          name: productData.name.trim(),
          description: productData.description.trim(),
          price: Number(productData.price),
          category: productData.category,
          Stock: Number(productData.Stock) || 1,
          images: productData.images || [],
        };
        console.log(updatedProductData);
        await updateProduct(productData._id, updatedProductData);
        setEditingProduct(null);
        toast.success("Product updated successfully");
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error(error.response?.data?.message || "Error updating product");
      }
    },
    [updateProduct]
  );

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout");
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        if (!isAuthenticated || !user) {
          await getUserProfile();
        }

        // Check if user is admin
        if (user && user.role !== "admin") {
          toast.error("Access denied. Admin privileges required.");
          navigate("/");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Please login again");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, isAuthenticated, user, getUserProfile]);

  // Add toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
      {/* Mobile Header - Always visible on mobile */}
      <div className="lg:hidden bg-gray-800 dark:bg-gray-200 p-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-white dark:text-gray-900 p-2 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isSidebarOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-purple-500 dark:text-purple-600">
            Admin Panel
          </h1>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
        >
          <FiHome className="w-4 h-4" />
          Home
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed top-0 left-0 h-screen bg-gray-800 dark:bg-gray-200
          transform transition-transform duration-300 ease-in-out z-30
          lg:sticky lg:transform-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-64 lg:block
          ${!isSidebarOpen && "lg:relative"}
        `}
        >
          <div className="p-6 hidden lg:block">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-purple-500 dark:text-purple-600">
                Admin Panel
              </h1>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                <FiHome className="w-4 h-4" />
                Home
              </button>
            </div>
          </div>
          <nav className="mt-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center w-full p-4 ${
                activeTab === "dashboard"
                  ? "bg-purple-500 bg-opacity-20 text-purple-500 dark:text-purple-600"
                  : "text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900"
              }`}
            >
              <FiHome className="mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center w-full p-4 ${
                activeTab === "products"
                  ? "bg-purple-500 bg-opacity-20 text-purple-500 dark:text-purple-600"
                  : "text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900"
              }`}
            >
              <FiPackage className="mr-3" />
              Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center w-full p-4 ${
                activeTab === "orders"
                  ? "bg-purple-500 bg-opacity-20 text-purple-500 dark:text-purple-600"
                  : "text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900"
              }`}
            >
              <FiBarChart2 className="mr-3" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center w-full p-4 ${
                activeTab === "users"
                  ? "bg-purple-500 bg-opacity-20 text-purple-500 dark:text-purple-600"
                  : "text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900"
              }`}
            >
              <FiUsers className="mr-3" />
              Users
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center w-full p-4 ${
                activeTab === "settings"
                  ? "bg-purple-500 bg-opacity-20 text-purple-500 dark:text-purple-600"
                  : "text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900"
              }`}
            >
              <FiSettings className="mr-3" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-4 text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900"
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <main
          className={`
          flex-1 p-4 lg:p-8 w-full
          transition-all duration-300
          ${isSidebarOpen ? "lg:ml-0" : "lg:ml-0"}
        `}
        >
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "products" && "Product Management"}
              {activeTab === "orders" && "Order Management"}
              {activeTab === "users" && "User Management"}
              {activeTab === "settings" && "Settings"}
            </h1>
          </div>

          {activeTab === "dashboard" && <DashboardStats />}
          {activeTab === "products" && (
            <ProductManagement
              products={products}
              loading={productLoading}
              handleDeleteProduct={handleDeleteProduct}
              formData={formData}
              handleInputChange={handleInputChange}
              handleImageChange={handleImageChange}
              imagePreview={imagePreview}
              handleAddProduct={handleAddProduct}
              handleUpdateProduct={handleUpdateProduct}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
            />
          )}
          {activeTab === "orders" && <OrderManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
