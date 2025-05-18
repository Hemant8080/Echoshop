import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import useWishlistStore from '../store/wishlistStore';
import useCartStore from '../store/cartStore';
import { formatINR } from '../utils/currencyUtils';
import Navbar from './Navbar';
import Footer from './Footer';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#121212] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-8">
            <Link to="/" className="text-purple-500 hover:text-purple-400 flex items-center gap-2">
              <FiArrowLeft />
              <span>Back to Shopping</span>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          
          {wishlist.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiHeart className="text-5xl text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
              <p className="text-gray-400 mb-6">Add items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
              <Link to="/" className="inline-block bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div key={item._id} className="bg-[#1a1a1a] rounded-xl overflow-hidden flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    {item.images && item.images.length > 0 && (
                      <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  <div className="p-4 flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-purple-400 text-lg font-bold mb-4">{formatINR(item.price)}</p>
                    <p className="text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="p-4 border-t border-gray-800 flex justify-between">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      <FiShoppingCart />
                      Add to Cart
                    </button>
                    
                    <button 
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="flex items-center gap-2 text-red-500 hover:text-red-400 py-2 px-4 rounded-lg transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist; 