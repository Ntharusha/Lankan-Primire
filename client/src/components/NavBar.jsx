import { Menu, Search, X, User } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Theaters', path: '/theaters' },
    { name: 'Releases', path: '/releases' },
    { name: 'Favourites', path: '/favourites' },
  ]

  return (
    <nav className='fixed top-0 left-0 z-[100] w-full px-6 md:px-16 lg:px-24 py-4 bg-transparent transition-all duration-300'>
        
        <div className='max-w-[1440px] mx-auto flex items-center justify-between'>
            
            {/* Logo Section - Size Increased Slightly */}
            <Link to='/' className='relative z-[110] shrink-0'>
                <img 
                    src={assets.logo} 
                    alt='logo' 
                    className='w-20 md:w-24 lg:w-28 h-auto hover:scale-105 transition-transform duration-300'
                />
            </Link>

            {/* Desktop Menu */}
            <div className='hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 w-fit flex-nowrap'>
                {navLinks.map((link) => (
                    <Link 
                        key={link.name}
                        to={link.path} 
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                                   ${location.pathname === link.path 
                                     ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                                     : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Right Side Tools & LOGIN */}
            <div className='flex items-center gap-4 md:gap-6 relative z-[110]'> 
                <div className='hidden sm:flex items-center bg-white/10 border border-white/10 rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-red-500 transition-all'>
                    <Search className='w-4 h-4 text-gray-400' />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className='bg-transparent border-none outline-none text-xs ml-2 w-20 lg:w-28 text-white' 
                    />
                </div>
                
                <button className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-bold py-2.5 px-6 md:px-8 rounded-full transition-all shadow-lg shadow-red-900/20'>
                    <User className='w-4 h-4' />
                    <span>LOGIN</span>
                </button>

                <button className='md:hidden text-white p-1' onClick={toggleMenu}>
                    {isOpen ? <X className='w-8 h-8' /> : <Menu className='w-8 h-8' />}
                </button>
            </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 h-screen w-full bg-black/95 backdrop-blur-2xl z-[105] flex flex-col items-center justify-center transition-all duration-500 md:hidden
                        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
            <div className='flex flex-col items-center gap-10'>
                {navLinks.map((link) => (
                    <Link 
                        key={link.name}
                        to={link.path} 
                        onClick={toggleMenu}
                        className={`text-2xl font-bold transition-all duration-300
                                   ${location.pathname === link.path ? 'text-red-600 scale-110' : 'text-white/80 hover:text-white'}`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </div>
    </nav>
  )
}

export default NavBar