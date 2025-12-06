import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, XIcon } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router';

const Footer = () => {
  const links = [
    <>
      <NavLink to="/" className="hover:text-blue-500 transition-colors">Home</NavLink>
      <NavLink to="/addTransaction" className="hover:text-blue-500 transition-colors">Browse Books</NavLink>
      <NavLink to="/dashboard" className="hover:text-blue-500 transition-colors">Dashboard</NavLink>
      <NavLink to="/login" className="hover:text-blue-500 transition-colors">Login / Register</NavLink>
    </>
  ];
  return (
    <footer className="bg-slate-950 text-slate-200 p-6 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Section 1: Brand & Quick Links */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold text-white mb-2">BookLibrary</h2>
            <nav className="flex flex-col space-y-2 text-sm text-slate-400">
              {links}
            </nav>
          </div>

          {/* Section 2: Contact Details */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span>123 Library Avenue, Knowledge City, 1200</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <span>+880 1234 567 890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <span>support@booklibrary.com</span>
              </div>
            </div>
          </div>

          {/* Section 3: Social Icons */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <p className="text-sm text-slate-400 mb-2">
              Stay connected for new arrivals and updates.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-black hover:text-white transition-all">
                <XIcon className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-700 hover:text-white transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} BookLibrary. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;