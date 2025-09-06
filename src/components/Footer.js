import React from 'react';
import { Leaf, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    // Company: ['About Us', 'Careers', 'Press', 'Contact'],
    // Company: [],
    // Product: [],
    // Resources: [],
    // Product: ['Features', 'Pricing', 'Partners', 'API'],
    // Resources: ['Help Center', 'Blog', 'Moving Guides', 'Cost Calculator'],
    Legal: ['Privacy Policy', 'Terms of Service'],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1 mb-4">
              
              <img 
      src="/images/footer_logo.jpg"// <-- your image path here
      alt="Logo"
      className="w-12 h-8 object-contain"
    />
            
            <span className="font-bold text-xl">
  Remove<span className="italic">A</span>List
</span>

            </div>
            <p className="text-gray-400 mb-6">
              AI-powered, sustainability-first moving project management for Australia.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2025 Simply Save Australia Pty Ltd ACN 147 223 461  
            Operating as 'RemoveAlist'. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

