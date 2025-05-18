import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    try {
      // In a real application, you would send this data to your backend
      // await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/contact`, formData);
      
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions, feedback, or need assistance? We're here to help! Reach out to our team using any of the methods below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Get in Touch</h2>
            
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <FiMail className="w-6 h-6 text-purple-400" />,
                  title: "Email Us",
                  details: "echoshop80@gmail.com",
                  description: "For general inquiries and support"
                },
                {
                  icon: <FiPhone className="w-6 h-6 text-purple-400" />,
                  title: "Call Us",
                  details: "+91 9876543210",
                  description: "Mon-Fri, 9am-6pm IST"
                },
                {
                  icon: <FiMapPin className="w-6 h-6 text-purple-400" />,
                  title: "Visit Us",
                  details: "123 Shopping Street, Mumbai, IN 12345",
                  description: "Our headquarters location"
                },
                {
                  icon: <FiMessageSquare className="w-6 h-6 text-purple-400" />,
                  title: "Live Chat",
                  details: "Available on our website",
                  description: "For immediate assistance"
                }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-4 mb-3">
                    {item.icon}
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                  </div>
                  <p className="text-white mb-1">{item.details}</p>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Map or Image */}
            <div className="mt-8">
              <div className="aspect-video relative overflow-hidden rounded-xl border border-purple-500/20">
                <img 
                  src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="EcoShop Location" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl border border-purple-500/20">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm">Your Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300 text-sm">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    placeholder="johndoe@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300 text-sm">Subject</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300 text-sm">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Please provide details about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FiSend />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-12 text-center text-purple-400">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How can I track my order?",
                answer: "You can track your order by logging into your account and visiting the Orders section. There you'll find real-time updates on your shipment status."
              },
              {
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy for most items. Products must be in their original condition with tags attached and original packaging."
              },
              {
                question: "Do you ship internationally?",
                answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on your location."
              },
              {
                question: "How can I become a vendor on EcoShop?",
                answer: "If you produce sustainable products and would like to sell on our platform, please email us at partners@ecoshop.com with details about your products."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-[#1E1E1E] p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-3 text-white">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
