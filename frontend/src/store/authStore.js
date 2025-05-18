import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = `${import.meta.env.VITE_BACKEND_URL
}/api/v1`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Function to parse JWT token and check if it's valid
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Parse token and get payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Check if token has expired
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    
    return exp > now;
  } catch (error) {
    console.error('Error parsing token:', error);
    return false;
  }
};

// Add request interceptor to include token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only attempt refresh once to prevent infinite loops
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear tokens and force re-login if token is invalid
      localStorage.removeItem('token');
      
      // Redirect to login in browser environments
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL
}/api/v1/login`,
        { email, password },
        { withCredentials: true }
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }

      set({
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });

      return true;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Login failed",
      });
      throw error;
    }
  },

  // Register
  register: async (formData) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      set({ user: data.user, isAuthenticated: true });
      toast.success('Registration successful');
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed' });
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      set({ loading: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL
}/api/v1/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common['Authorization'];
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  // Check if user is admin
  checkAdminRole: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL
}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return data.user?.role === "admin";
    } catch (error) {
      console.error("Admin check error:", error);
      return false;
    }
  },

  // Get User Profile
  getUserProfile: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ loading: false });
        return;
      }

      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL
}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      set({
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common['Authorization'];
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: error.response?.data?.message || "Failed to get user profile",
      });
      throw error;
    }
  },

  // Update Profile
  updateProfile: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL
}/api/v1/me/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        set({ user: response.data.user });
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to update profile" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Update Password
  updatePassword: async (passwords) => {
    try {
      set({ loading: true });
      await api.put('/password/update', passwords);
      toast.success('Password updated successfully');
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update password' });
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      set({ loading: false });
    }
  },

  // Forget Password
  forgetPassword: async (email) => {
    try {
      set({ loading: true });
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL
}/api/v1/password/forgot`,
        { email }
      );
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Reset Password
  resetPassword: async (token, password, confirmPassword) => {
    try {
      set({ loading: true });
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL
}/api/v1/password/reset/${token}`,
        { password, confirmPassword }
      );
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Clear Error
  clearError: () => set({ error: null }),

  // Check token validity
  checkTokenValidity: () => {
    const token = localStorage.getItem('token');
    if (!token || !isTokenValid(token)) {
      // Clear invalid token
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
      return false;
    }
    return true;
  },

  // Initialize auth state from localStorage
  initializeAuth: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL
}/api/v1/me`, {
          withCredentials: true,
        });
        set({
          user: data.user,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    }
  },
}));

// Remove the automatic profile fetch on mount
// useAuthStore.getState().getUserProfile();

export default useAuthStore; 