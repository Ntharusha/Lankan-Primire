
import React from 'react'
import { assets } from '../assets/assets'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#050905] py-12 text-gray-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={assets.logo} alt="Lankan Premiere" className="w-10 h-auto" />
              <span className="text-white font-bold text-xl">Lankan Premiere</span>
            </Link>
            <p className="text-sm text-gray-500">
              Your premier destination for Sinhala cinema. Experience the best movies from Sri Lanka.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/movies" className="hover:text-red-500 transition-colors">Movies</Link></li>
              <li><Link to="/movies" className="hover:text-red-500 transition-colors">Coming Soon</Link></li>
              <li><Link to="/fav" className="hover:text-red-500 transition-colors">Favorites</Link></li>
              <li><Link to="/my-bookings" className="hover:text-red-500 transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-[#121418] p-2 rounded-full hover:bg-red-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-[#121418] p-2 rounded-full hover:bg-red-600 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-[#121418] p-2 rounded-full hover:bg-red-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-[#121418] p-2 rounded-full hover:bg-red-600 hover:text-white transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-sm text-gray-500">&copy; 2025 Lankan Premiere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

