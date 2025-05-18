import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX, FiLogOut, FiLock, FiUpload, FiBox, FiSettings } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateProfile, logout, loading: authLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      setAvatarPreview(user.avatar?.url || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/orders/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setOrders(data.orders || []);
      } catch (error) {
        toast.error('Failed to fetch order history');
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      await updateProfile(formDataToSend);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const goToAdminPanel = () => {
    navigate('/admin');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <div className="flex items-center gap-4">
              {/* Admin Panel Button - Only visible to admin users */}
              {user?.role === 'admin' && (
                <button
                  onClick={goToAdminPanel}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <FiSettings />
                  Admin Panel
                </button>
              )}
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <FiEdit2 />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <FiSave />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <FiX />
                    Cancel
                  </button>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>

          {/* Debug Role Info */}
          {user?.role === 'admin' && (
            <div className="mb-4 p-4 bg-purple-900/30 rounded-lg">
              <p className="text-purple-300">You have admin privileges. Access the Admin Panel using the button above.</p>
            </div>
          )}

          {/* Profile Content */}
          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/20">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-500/20 flex items-center justify-center">
                        <FiUser className="w-16 h-16 text-white/40" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full cursor-pointer hover:bg-purple-600 transition-colors"
                  >
                    <FiUpload className="w-4 h-4 text-white" />
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-4 text-white/80 text-sm">Click to change avatar</p>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSave} className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/40
                               focus:outline-none focus:border-purple-500 transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/40
                               focus:outline-none focus:border-purple-500 transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Phone</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/40
                               focus:outline-none focus:border-purple-500 transition-all"
                      placeholder="Enter your phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/40
                               focus:outline-none focus:border-purple-500 transition-all"
                      rows="3"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg transition-colors
                           transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>

          {/* Order History Section */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-400">
              <FiBox /> Order History
            </h2>
            {ordersLoading ? (
              <div className="text-white/80">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-white/60">No orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Total</th>
                      <th className="px-4 py-2 text-left">Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-800 hover:bg-[#232136] transition-colors">
                        <td className="px-4 py-2 font-mono text-purple-300">{order._id.slice(-8)}</td>
                        <td className="px-4 py-2">{new Date(order.paidAt).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.orderStatus === 'Delivered' ? 'bg-green-600/20 text-green-400' : order.orderStatus === 'Shipped' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-purple-600/20 text-purple-400'}`}>{order.orderStatus}</span>
                        </td>
                        <td className="px-4 py-2">${order.totalPrice.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          <ul className="list-disc ml-4">
                            {order.orderItems.map((item) => (
                              <li key={item.product} className="text-sm">
                                {item.name} x{item.quantity}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 