import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      loading: false,
      error: null,

      // Add to Cart
      addToCart: (product) => {
        const currentCart = get().cart || [];
        const existingItem = currentCart.find(item => item._id === product._id);

        if (existingItem) {
          const updatedCart = currentCart.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          set({ cart: updatedCart });
        } else {
          set({ cart: [...currentCart, { ...product, quantity: 1 }] });
        }
        toast.success('Added to cart');
      },

      // Update Cart Item Quantity
      updateCartItemQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        const currentCart = get().cart || [];
        set({
          cart: currentCart.map(item =>
            item._id === productId ? { ...item, quantity } : item
          ),
        });
      },

      // Remove from Cart
      removeFromCart: (productId) => {
        const currentCart = get().cart || [];
        set({ cart: currentCart.filter(item => item._id !== productId) });
        toast.success('Removed from cart');
      },

      // Clear Cart
      clearCart: () => {
        set({ cart: [] });
      },

      // Get Cart Items
      getCartItems: () => {
        return get().cart || [];
      },

      // Get Total Items
      getTotalItems: () => {
        const currentCart = get().cart || [];
        return currentCart.reduce((total, item) => total + item.quantity, 0);
      },

      // Get Total Price
      getTotalPrice: () => {
        const currentCart = get().cart || [];
        return currentCart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore; 