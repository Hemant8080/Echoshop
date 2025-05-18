import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      
      // Add to Wishlist
      addToWishlist: (product) => {
        const currentWishlist = get().wishlist || [];
        const existingItem = currentWishlist.find(item => item._id === product._id);
        
        if (existingItem) {
          toast.error('Item already in wishlist');
          return;
        } else {
          set({ wishlist: [...currentWishlist, product] });
          toast.success('Added to wishlist');
        }
      },
      
      // Remove from Wishlist
      removeFromWishlist: (productId) => {
        const currentWishlist = get().wishlist || [];
        set({ wishlist: currentWishlist.filter(item => item._id !== productId) });
        toast.success('Removed from wishlist');
      },
      
      // Check if item is in wishlist
      isInWishlist: (productId) => {
        const currentWishlist = get().wishlist || [];
        return currentWishlist.some(item => item._id === productId);
      },
      
      // Clear Wishlist
      clearWishlist: () => {
        set({ wishlist: [] });
      },
      
      // Get Wishlist Items
      getWishlistItems: () => {
        return get().wishlist || [];
      },
      
      // Get Wishlist Count
      getWishlistCount: () => {
        return (get().wishlist || []).length;
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlistStore;
