import { Menu, Search, X, User, LogOut, Settings, LayoutDashboard, ChevronDown, Heart, Star, Layout } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import LoyaltyBadge from './LoyaltyBadge'

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`)
            setIsOpen(false) // Close mobile menu if open
        }
    }

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)

        // Sync search query from URL
        const params = new URLSearchParams(location.search)
        const q = params.get('search')
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (q) setSearchQuery(q)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        else setSearchQuery('')

        return () => window.removeEventListener('scroll', handleScroll)
    }, [location.search])

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    }, [isOpen])

    const toggleMenu = () => setIsOpen(!isOpen)

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Movies', path: '/movies' },
        { name: 'Theaters', path: '/theaters' },
        { name: 'Favourites', path: '/fav', protected: true },
        { name: 'My Bookings', path: '/my-bookings', protected: true },
    ]

    const filteredLinks = navLinks.filter(link => !link.protected || user)

    return (
        <nav className={`fixed top-0 left-0 z-[100] w-full px-6 md:px-16 lg:px-24 py-4 transition-all duration-500 ${scrolled ? 'glass-nav h-20' : 'bg-transparent h-24'}`}>

            <div className='max-w-[1440px] mx-auto flex items-center justify-between h-full'>

                {/* Logo Section */}
                <Link to='/' className='relative z-[110] shrink-0 flex items-center gap-3'>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-nebula-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 transition-transform hover:rotate-0">
                        <img src={assets.logo} alt='logo' className='w-7 h-auto' />
                    </div>
                    <span className="hidden md:block font-black text-xl tracking-tighter text-white uppercase italic">Lankan <span className="text-primary">Premiere</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className='hidden md:flex items-center gap-1 glass-card px-2 py-1.5 rounded-full border-white/5'>
                    {filteredLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap uppercase tracking-widest
                                   ${location.pathname === link.path
                                    ? 'bg-primary text-white shadow-lg shadow-primary/40'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="px-5 py-2 rounded-full text-xs font-black text-primary border border-primary/20 hover:bg-primary/10 transition-all uppercase tracking-widest"
                        >
                            HQ
                        </Link>
                    )}
                </div>

                {/* Right Side Tools */}
                <div className='flex items-center gap-4 md:gap-6 relative z-[110]'>
                    <form onSubmit={handleSearch} className='hidden sm:flex items-center glass-card border-none rounded-2xl px-4 py-2 hover:ring-1 hover:ring-primary/50 transition-all'>
                        <button type="submit" className="hover:scale-110 transition-transform cursor-pointer">
                            <Search className='w-4 h-4 text-primary' />
                        </button>
                        <input
                            type="text"
                            placeholder="Find a movie..."
                            className='bg-transparent border-none outline-none text-xs ml-3 w-32 lg:w-48 text-white placeholder-gray-500 font-medium'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 p-1.5 glass-card rounded-2xl border-white/10 hover:border-primary/30 transition-all"
                            >
                                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <User size={18} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white hidden lg:block mr-2">{user.name.split(' ')[0]}</span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute top-full right-0 mt-4 w-48 glass-card p-2 rounded-2xl border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-white/5 rounded-t-2xl">
                                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-white font-bold truncate">{user.name}</p>
                                            <p className="text-gray-500 text-xs truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 border-b border-white/5">
                                        <LoyaltyBadge points={user.loyaltyPoints} />
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                                    >
                                        Termination Session
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className='flex items-center gap-3 btn-primary text-xs md:text-sm font-black py-3 px-8 rounded-2xl transition-all uppercase tracking-tighter'
                        >
                            <User className='w-4 h-4' />
                            <span>Login</span>
                        </Link>
                    )}

                    <button className='md:hidden text-white p-2 glass-card border-none rounded-xl' onClick={toggleMenu}>
                        {isOpen ? <X className='w-6 h-6 text-primary' /> : <Menu className='w-6 h-6' />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 h-screen w-full bg-nebula-deep/95 backdrop-blur-3xl z-[105] flex flex-col items-center justify-center transition-all duration-500 md:hidden
                        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}>
                <div className='flex flex-col items-center gap-8 w-full px-10'>
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className='flex items-center w-full glass-card border-none rounded-2xl px-6 py-4 hover:ring-1 hover:ring-primary/50 transition-all'>
                        <button type="submit" className="hover:scale-110 transition-transform cursor-pointer">
                            <Search className='w-5 h-5 text-primary' />
                        </button>
                        <input
                            type="text"
                            placeholder="Find a movie..."
                            className='bg-transparent border-none outline-none text-base ml-4 w-full text-white placeholder-gray-500 font-medium'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <div className='flex flex-col items-center gap-6'>
                        {filteredLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={toggleMenu}
                                className={`text-2xl font-black uppercase tracking-tighter transition-all duration-300
                                       ${location.pathname === link.path ? 'text-primary scale-110' : 'text-gray-500 hover:text-white'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {!user && (
                            <Link
                                to="/login"
                                onClick={toggleMenu}
                                className="text-primary text-2xl font-black uppercase tracking-tighter"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar