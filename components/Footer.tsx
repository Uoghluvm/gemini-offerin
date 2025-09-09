import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-800 text-white mt-12">
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-blue-400">GlobalEd</h3>
          <p className="mt-2 text-gray-400 text-sm">Your partner in global education.</p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
            <li><Link to="/mentors" className="text-gray-400 hover:text-white">Mentors</Link></li>
            <li><Link to="/community" className="text-gray-400 hover:text-white">Community</Link></li>
            <li><Link to="/ai-helper" className="text-gray-400 hover:text-white">AI Helper</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
           <ul className="mt-2 space-y-2 text-sm">
            <li className="flex items-center"><Mail size={16} className="mr-2"/> contact@globaled.com</li>
           </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} GlobalEd Mentor. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
