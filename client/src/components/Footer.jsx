import React from 'react'
import { assets } from '../assets/assets'
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-nebula-deep py-20 border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          {/* Brand & Mission */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/50">
                <img src={assets.logo} alt="Lankan Premiere" className="w-8 h-auto" />
              </div>
              <span className="text-white font-black text-3xl tracking-tighter uppercase italic">Lankan <span className="text-primary text-4xl">P</span></span>
            </Link>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md font-medium">
              Redefining the Sri Lankan cinema experience. We bring the magic of the silver screen to your hands with cutting-edge technology and premium comfort.
            </p>

            <div className="flex gap-4 mt-10">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center hover:btn-primary hover:text-white transition-all duration-500">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="md:col-span-3">
            <h4 className="text-white font-black mb-8 uppercase text-xs tracking-[0.2em] opacity-40">Experience</h4>
            <ul className="space-y-4 font-bold">
              {['Movies', 'Premium Theaters', 'Canteen Pre-order', 'Group Booking', 'Loyalty Program'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-white font-black mb-8 uppercase text-xs tracking-[0.2em] opacity-40">Contact HQ</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <p className="text-gray-400 font-medium">123 Cinema Plaza, Colombo 03, Sri Lanka</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <p className="text-gray-400 font-medium">+94 11 234 5678</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <p className="text-gray-400 font-medium">concierge@lankanpremiere.lk</p>
              </div>
            </div>

            <div className="mt-10 p-4 glass-card rounded-2xl border-primary/20 bg-primary/5">
              <p className="text-xs text-white font-bold uppercase tracking-widest mb-1">PWA Status</p>
              <p className="text-[10px] text-gray-500 font-medium">Ready for offline installation</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">
            &copy; 2025 Lankan Premiere. Engineered for Connoisseurs.
          </p>
          <div className="flex gap-8 text-xs font-black text-gray-700 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
