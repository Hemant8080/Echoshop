import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-purple-600/90 to-purple-900/90 backdrop-blur-md">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-3 md:grid-cols-3  gap-10">
          <div className="space-y-4">
            <Link to="/" className="text-3xl font-bold text-white hover:scale-105 transition-transform inline-block">
             Echoshop
            </Link>
            <p className="text-white/80 leading-relaxed">
              Your one-stop destination for premium products at unbeatable prices. Shop with confidence and style.
            </p>
            <div className="flex items-center space-x-4 text-white/80">
              <FiMapPin className="w-5 h-5 flex-shrink-0" />
              <span>123 Shopping Street, IN 12345</span>
            </div>
            <div className="flex items-center space-x-4 text-white/80">
              <FiPhone className="w-5 h-5 flex-shrink-0" />
              <span>+91 9876543210</span>
            </div>
            <div className="flex items-center space-x-4 text-white/80">
              <FiMail className="w-5 h-5 flex-shrink-0" />
              <span>echoshop80@gmail.com</span>
            </div>
          </div>
          
          <div className='pl-20'>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Products', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-white/80 hover:text-white transition-colors inline-block hover:translate-x-2 transition-transform"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Newsletter</h4>
            <p className="text-white/80 mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/60 
                         focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
              />
              <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg transition-all">
                Subscribe
              </button>
            </div>
            
            <div className="mt-8">
              <h5 className="text-white mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                {[FiGithub, FiTwitter, FiInstagram, FiFacebook].map((Icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="bg-white/10 p-2.5 rounded-lg hover:bg-white/20 hover:scale-110 transition-all"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Echoshop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 