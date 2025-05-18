import { useState, useEffect } from "react";
import { formatINR } from "../utils/currencyUtils";
import { FiShoppingCart, FiHeart, FiStar, FiShare2 } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useProductStore from "../store/productStore";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import { toast } from "react-hot-toast";
import Loader from "./common/Loader";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { getProductDetails, productDetails, loading, clearProductDetails } = useProductStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        await getProductDetails(id);
      } catch (error) {
        navigate("/products");
      }
    };

    fetchProduct();

    return () => {
      clearProductDetails();
    };
  }, [id, navigate, getProductDetails, clearProductDetails]);

  useEffect(() => {
    if (productDetails && productDetails._id) {
      setInWishlist(isInWishlist(productDetails._id));
    }
  }, [productDetails, isInWishlist]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (productDetails.Stock < 1) {
      toast.error("Product is out of stock");
      return;
    }

    // Add the product with the selected quantity
    const productToAdd = {
      ...productDetails,
      quantity: quantity
    };
    
    addToCart(productToAdd);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    if (inWishlist) {
      removeFromWishlist(productDetails._id);
      setInWishlist(false);
    } else {
      addToWishlist(productDetails);
      setInWishlist(true);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL
}/api/v1/review`,
        {
          rating,
          comment,
          productId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Review submitted successfully");
        setRating(0);
        setComment("");
        // Refresh product details to show new review
        await getProductDetails(id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting review");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!productDetails) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#121212] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-[#1E1E1E]">
                <img
                  src={productDetails.images[selectedImage].url}
                  alt={productDetails.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                  <FiShare2 className="text-xl" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {productDetails.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      selectedImage === index ? "ring-2 ring-purple-500" : ""
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${productDetails.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{productDetails.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-yellow-400">
                    <FiStar className="fill-current" />
                    <span className="ml-1">{productDetails.ratings || 0}</span>
                  </div>
                  <span className="text-gray-400">({productDetails.numOfReviews || 0} reviews)</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-purple-500">
                {formatINR(productDetails.price)}
              </div>

              <p className="text-gray-300">{productDetails.description}</p>

              <div className="space-y-2">
                <h3 className="font-semibold">Category:</h3>
                <p className="text-gray-300">{productDetails.category}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-xl hover:bg-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-xl hover:bg-gray-800"
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={productDetails.Stock < 1}
                  className={`flex-1 flex items-center justify-center gap-2 ${productDetails.Stock < 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white py-3 px-6 rounded-lg transition-colors`}
                >
                  <FiShoppingCart />
                  {productDetails.Stock < 1 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button 
                  onClick={handleWishlist}
                  className={`flex items-center justify-center gap-2 ${inWishlist ? 'bg-purple-600 text-white' : 'border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'} py-3 px-6 rounded-lg transition-colors`}
                >
                  <FiHeart />
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Availability:</span>
                  <span className={productDetails.Stock > 0 ? "text-green-500" : "text-red-500"}>
                    {productDetails.Stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            
            {/* Review Form */}
            {isAuthenticated && (
              <div className="bg-[#1E1E1E] p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-2xl"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <FiStar
                            className={`${
                              star <= (hoverRating || rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-[#2A2A2A] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="4"
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {productDetails.reviews && productDetails.reviews.length > 0 ? (
                productDetails.reviews.map((review) => (
                  <div key={review._id} className="bg-[#1E1E1E] p-6 rounded-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {(review.name && review.name.charAt(0).toUpperCase()) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{review.name || 'Anonymous User'}</h4>
                        <div className="flex items-center gap-1 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`${i < review.rating ? "fill-current" : ""}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail; 