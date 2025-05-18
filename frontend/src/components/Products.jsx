import React, { useEffect, useState } from "react";
import { formatINR } from "../utils/currencyUtils";
import { useNavigate } from 'react-router-dom';
import useProductStore from "../store/productStore";
import useCartStore from "../store/cartStore";
import { toast } from 'react-hot-toast';
import Loader from "../components/common/Loader";

const Products = () => {
  const navigate = useNavigate();
  const {
    products,
    loading,
    error,
    fetchProducts,
    searchProducts
  } = useProductStore();

  const { addToCart } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Extract unique categories from products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(product => product.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);
  
  // Filter products based on search query and filters
  useEffect(() => {
    let result = [...products];
    
    // Apply search query filter
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (max) {
        result = result.filter(product => 
          product.price >= Number(min) && product.price <= Number(max)
        );
      } else {
        // For "10000+" case
        result = result.filter(product => product.price >= Number(min.replace('+', '')));
      }
    }
    
    setFilteredProducts(result);
  }, [searchQuery, categoryFilter, priceRange, products]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    toast.success('Added to cart!');
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-violet-900/90 to-indigo-900/90"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Our Products
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Discover our collection of premium products
          </p>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-[#1a1a1a] rounded-xl p-4 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#252525] text-white border border-white/10 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-purple-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Category Filter Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-[#252525] text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div className="w-full md:w-48">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-[#252525] text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              >
                <option value="">Any Price</option>
                <option value="0-1000">Under ₹1,000</option>
                <option value="1000-5000">₹1,000 - ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000+">Over ₹10,000</option>
              </select>
            </div>
            
            {/* Clear Filters Button */}
            <div className="w-full md:w-auto">
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                  setPriceRange('');
                }}
                className="w-full md:w-auto px-4 py-3 bg-[#252525] text-gray-400 hover:text-white border border-white/10 rounded-lg focus:outline-none hover:bg-[#303030] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product._id}
              className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-purple-500/30 transition-all duration-300"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={product.images && product.images.length > 0 && product.images[0].url ? product.images[0].url : 'https://via.placeholder.com/400x400?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Stock Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-full border border-white/10">
                    {product.stock} left
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">{product.category}</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span className="text-xs text-gray-400">{product.ratings ? product.ratings.toFixed(1) : 'No ratings'}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mt-4">
                  <p className="text-2xl font-bold text-purple-500">{formatINR(product.price)}</p>
                  <button 
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium z-10 relative"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium pointer-events-auto">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">No products found</h2>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setPriceRange('');
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 