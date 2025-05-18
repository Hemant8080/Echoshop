import React from 'react';
import { FiUsers, FiTarget, FiAward, FiTruck, FiStar, FiShield } from 'react-icons/fi';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            About EcoShop
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your premier destination for sustainable and eco-friendly products that combine style, functionality, and environmental consciousness.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Our Story</h2>
            <p className="text-gray-300 mb-4">
              Founded in 2023, EcoShop emerged from a simple yet powerful vision: to make sustainable shopping accessible, affordable, and enjoyable for everyone.
            </p>
            <p className="text-gray-300 mb-4">
              What started as a small online store with just a handful of eco-friendly products has grown into a comprehensive marketplace offering thousands of sustainable alternatives across multiple categories.
            </p>
            <p className="text-gray-300">
              Our journey has been guided by our commitment to environmental stewardship, ethical business practices, and exceptional customer service. We believe that every purchase is a vote for the kind of world we want to live in, and we're proud to help our customers make choices that align with their values.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl border border-purple-500/20">
            <div className="aspect-video relative overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1313&q=80" 
                alt="EcoShop Team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center text-purple-400">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiShield className="w-10 h-10 text-purple-400" />,
                title: "Sustainability",
                description: "We prioritize products that minimize environmental impact, from materials to manufacturing processes to packaging."
              },
              {
                icon: <FiAward className="w-10 h-10 text-purple-400" />,
                title: "Quality",
                description: "We believe sustainable products should never compromise on quality, durability, or performance."
              },
              {
                icon: <FiUsers className="w-10 h-10 text-purple-400" />,
                title: "Community",
                description: "We foster a community of conscious consumers and support ethical producers who share our values."
              },
            ].map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center text-purple-400">Why Choose EcoShop</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiStar className="w-8 h-8 text-purple-400" />,
                title: "Curated Selection",
                description: "Every product in our store is carefully selected for its sustainability credentials and quality."
              },
              {
                icon: <FiTruck className="w-8 h-8 text-purple-400" />,
                title: "Carbon-Neutral Shipping",
                description: "We offset the carbon footprint of every delivery to minimize environmental impact."
              },
              {
                icon: <FiTarget className="w-8 h-8 text-purple-400" />,
                title: "Transparent Sourcing",
                description: "We provide detailed information about where and how our products are made."
              },
            ].map((feature, index) => (
              <div key={index} className="flex gap-4 p-6 bg-[#1E1E1E] rounded-xl hover:bg-[#252525] transition-colors">
                <div className="mt-1">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Our Mission */}
        <div className="text-center bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-12 rounded-2xl border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-6 text-white">Join Our Mission</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Together, we can make a difference. Every sustainable choice matters, and we're here to make those choices easier for you.
          </p>
          <a href="/products" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Shop Sustainably
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
