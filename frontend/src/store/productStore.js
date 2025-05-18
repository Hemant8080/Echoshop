import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  productDetails: null,
  filteredProducts: [],

  // Fetch all products
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL
}/api/v1/products`);
      console.log(data)
      set({ 
        products: data.products,
        filteredProducts: data.products,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error("Error fetching products");
    }
  },

  // Get product details
  getProductDetails: async (id) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL
}/api/v1/product/${id}`);
      set({ 
        productDetails: data.product,
        loading: false 
      });
      return data.product;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error("Error fetching product details");
      throw error;
    }
  },

  // Clear product details
  clearProductDetails: () => {
    set({ productDetails: null });
  },

  // Filter products by category
  filterProductsByCategory: (category) => {
    set((state) => ({
      filteredProducts: category === "all" 
        ? state.products 
        : state.products.filter(product => product.category === category)
    }));
  },

  // Search products
  searchProducts: (query) => {
    set((state) => ({
      filteredProducts: state.products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
    }));
  },

  // Sort products
  sortProducts: (sortBy) => {
    set((state) => ({
      filteredProducts: [...state.filteredProducts].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return b.ratings - a.ratings;
          default:
            return 0;
        }
      })
    }));
  },

  // Reset filters
  resetFilters: () => {
    set((state) => ({
      filteredProducts: state.products
    }));
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('Stock', productData.Stock);

      for (let i = 0; i < productData.images.length; i++) {
        formData.append('images', productData.images[i]);
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL
}/api/v1/admin/product/new`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.data.success) {
        set(state => ({
          products: [...state.products, response.data.product],
          filteredProducts: [...state.filteredProducts, response.data.product],
          loading: false
        }));
        toast.success('Product created successfully');
        return response.data.product;
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.response?.data?.message || 'Error creating product');
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.Stock);

      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }

      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL
}/api/v1/admin/product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (data.success) {
        set((state) => ({
          products: state.products.map((product) =>
            product._id === id ? data.product : product
          ),
          filteredProducts: state.filteredProducts.map((product) =>
            product._id === id ? data.product : product
          ),
          loading: false,
        }));
        toast.success("Product updated successfully");
        return data.product;
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.response?.data?.message || "Error updating product");
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL
}/api/v1/admin/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        filteredProducts: state.filteredProducts.filter((product) => product._id !== id),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.response?.data?.message || "Error deleting product");
    }
  },

  // Create review
  createReview: async (reviewData) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL
}/api/v1/review`,
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL
}/api/v1/reviews?productId=${productId}`
      );
      set({ loading: false });
      return data.reviews;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export default useProductStore;
