import React from 'react';
import { NavLink } from 'react-router';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Library
} from 'lucide-react';
const XLogo = ({ className }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);
const Footer = () => {
  return (
    <footer className="relative w-full p-2  overflow-hidden bg-zinc-900 text-white shadow-xl">
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="container mx-auto p-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Library className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold tracking-tight">BookLibrary</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Connecting readers with stories. We provide the fastest book delivery service and a curated collection for every genre.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
            <nav className="flex flex-col space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/all-books">Browse Collection</FooterLink>
              <FooterLink to="/dashboard">User Dashboard</FooterLink>
              <FooterLink to="/">Pricing & Plans</FooterLink>
            </nav>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <nav className="flex flex-col space-y-3">
              <FooterLink to="/login">Login / Register</FooterLink>
              <FooterLink to="/">Help Center</FooterLink>
              <FooterLink to="/">Terms of Service</FooterLink>
              <FooterLink to="/">Privacy Policy</FooterLink>
            </nav>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <div className="flex flex-col space-y-4 text-sm text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
                <span>123 Library Avenue,<br />Knowledge City, 1200</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <span>+880 1234 567 890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <span>support@booklibrary.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} BookLibrary Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} label="Facebook" />
            <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} label="Instagram" />
            <SocialLink href="#" icon={<XLogo className="h-4 w-4" />} label="X (Twitter)" />
            <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <NavLink
    to={to}
    className="text-sm text-zinc-400 hover:text-blue-400 transition-colors duration-200 w-fit">
    {children}
  </NavLink>
);

const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    aria-label={label}
    className="text-zinc-500 hover:text-white transition-colors duration-200 hover:scale-110 transform">
    {icon}
  </a>
);

export default Footer;