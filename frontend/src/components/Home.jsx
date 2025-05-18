import { Link } from "react-router-dom";
import { FiArrowRight, FiStar, FiShoppingCart, FiHeart } from "react-icons/fi";

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.99,
      rating: 4.8,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 199.99,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
    {
      id: 3,
      name: "Professional Camera",
      price: 799.99,
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
    },
    {
      id: 4,
      name: "Designer Backpack",
      price: 129.99,
      rating: 4.7,
      reviews: 64,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    },
  ];

  const categories = [
    {
      id: 1,
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
      itemCount: 320,
    },
    {
      id: 2,
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500",
      itemCount: 450,
    },
    {
      id: 3,
      name: "Home & Living",
      image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500",
      itemCount: 280,
    },
    {
      id: 4,
      name: "Sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500",
      itemCount: 175,
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920"
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-gray-900/90" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-white/90 mb-8 animate-fade-in delay-200">
              Shop the latest trends in fashion, electronics, home goods, and more at unbeatable prices.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full 
                       transition-all transform hover:scale-105 animate-fade-in delay-400"
            >
              <span>Shop Now</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/10 transition-all"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full 
                                   hover:bg-white/20 transition-all">
                    <FiHeart className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="text-white/60 text-sm">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">${product.price}</span>
                    <button className="p-2 bg-purple-500 hover:bg-purple-600 rounded-full transition-colors">
                      <FiShoppingCart className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="group relative h-80 rounded-2xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                  <p className="text-white/80">{category.itemCount} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Stay Updated</h2>
            <p className="text-white/80 mb-8">
              Subscribe to our newsletter and get exclusive offers, new product alerts, and insider-only discounts.
            </p>
            <div className="flex space-x-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border-2 border-white/20 text-white 
                         placeholder-white/60 focus:outline-none focus:border-white/40 transition-all"
              />
              <button className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
