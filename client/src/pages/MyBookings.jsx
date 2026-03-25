import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Ticket, ChevronRight, Eye, Trash2, Sparkles, AlertCircle, ShoppingBag, PhoneCall } from 'lucide-react'
import { useBookings } from '../context/BookingContext'
import TicketWallet from '../components/TicketWallet'
import { AnimatePresence, motion } from 'framer-motion'
import { getPosterUrl } from '../utils/movieUtils'
import { useAuth } from '../context/AuthContext'
import LoyaltyBadge from '../components/LoyaltyBadge'

const MyBookings = () => {
    const { user } = useAuth()
    const { bookings, removeBooking, getUpcomingBookings, getPastBookings } = useBookings()
    const [viewingBooking, setViewingBooking] = useState(null)

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
    };

    const upcomingBookings = getUpcomingBookings()
    const pastBookings = getPastBookings()

    if (bookings.length === 0) {
        return (
            <div className="min-h-screen pt-40 pb-16 px-8 flex flex-col items-center justify-center">
                <motion.div 
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="max-w-xl w-full glass-card p-12 rounded-[4rem] text-center relative border border-white/5"
                >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/20 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center border border-primary/30 shadow-2xl shadow-primary/20">
                        <Ticket className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 mt-6 leading-none italic">
                        Your <span className="text-gradient">Portfolio</span> is Empty
                    </h1>
                    <p className="text-gray-500 font-medium mb-12 leading-relaxed text-lg">
                        You haven't reserved any cinematic experiences yet. Explore the latest premieres and secure your front-row seats.
                    </p>
                    
                    <Link to="/movies" className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                        Explore Premireres <ChevronRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-32 pb-16 px-6 md:px-16 lg:px-24 bg-[#050608]">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-[2px] bg-primary"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Cinematic Collection</span>
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
                            My <span className="text-gradient">Bookings</span>
                        </h1>
                    </motion.div>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                        {user && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <LoyaltyBadge points={user.loyaltyPoints} />
                            </motion.div>
                        )}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card px-8 py-4 rounded-3xl border-primary/20 bg-primary/5 flex items-center gap-6"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/30">
                                {bookings.length}
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Digital Wallet</p>
                                <p className="text-white font-black uppercase text-sm">Active Reservations</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Upcoming Section */}
                {upcomingBookings.length > 0 && (
                    <div className="mb-24">
                        <div className="flex items-center gap-6 mb-12">
                            <Sparkles className="text-primary w-5 h-5" />
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white">Confirmed Premireres</h2>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            {upcomingBookings.map((booking, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={booking._id}
                                    className="group relative"
                                >
                                    {/* Perforated Effect Simulation */}
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050608] border-r border-white/5 z-10 hidden lg:block"></div>
                                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050608] border-l border-white/5 z-10 hidden lg:block"></div>
                                    
                                    <div className="glass-card rounded-[3.5rem] overflow-hidden border-white/5 relative bg-gradient-to-br from-white/[0.03] to-transparent hover:border-primary/30 transition-all duration-700">
                                        <div className="flex flex-col lg:flex-row">
                                            {/* Poster Column */}
                                            <div className="lg:w-80 aspect-[4/5] overflow-hidden relative border-r border-white/5">
                                                <img 
                                                   src={getPosterUrl(booking.show?.movie?.poster_path)} 
                                                   alt={booking.show?.movie?.title} 
                                                   onError={handleImageError}
                                                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent opacity-60"></div>
                                                
                                                {/* WhatsApp Status Overlay */}
                                                {booking.user?.phone && (
                                                    <div className="absolute top-6 left-6 flex items-center gap-3 bg-green-500/20 backdrop-blur-xl border border-green-500/30 px-4 py-2 rounded-full">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                                        <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">WhatsApp Sent</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info Column */}
                                            <div className="flex-1 p-10 lg:p-14 flex flex-col justify-between">
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Official Pass</span>
                                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">ID: {booking._id}</span>
                                                        </div>
                                                        <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-4 group-hover:text-primary transition-colors duration-500">
                                                            {booking.show?.movie?.title || 'Cinematic Event'}
                                                        </h3>
                                                        <div className="flex items-center gap-6 text-gray-500">
                                                            <div className="flex items-center gap-2">
                                                                <PhoneCall className="w-3.5 h-3.5" />
                                                                <span className="text-xs font-bold">{booking.user?.phone || 'No WhatsApp Contact'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-left md:text-right bg-white/[0.04] p-6 rounded-3xl border border-white/5">
                                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Premium</p>
                                                        <p className="text-4xl font-black text-white italic tracking-tighter">Rs. {booking.amount}</p>
                                                    </div>
                                                </div>

                                                {/* Details Grid */}
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12 p-10 bg-black/40 rounded-[2.5rem] border border-white/5 relative overflow-hidden group/inner">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[4rem] group-hover/inner:bg-primary/20 transition-all duration-700"></div>
                                                    
                                                    <div className="space-y-2 relative">
                                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-2">
                                                            <Calendar className="w-3 h-3" /> Showtime Date
                                                        </p>
                                                        <p className="text-lg font-black uppercase text-white tracking-tight italic">
                                                            {new Date(booking.show.showDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2 relative">
                                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-2">
                                                            <Clock className="w-3 h-3" /> Premiere Time
                                                        </p>
                                                        <p className="text-lg font-black uppercase text-white tracking-tight italic">
                                                            {new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2 relative">
                                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-2">
                                                            <MapPin className="w-3 h-3" /> Theater Location
                                                        </p>
                                                        <p className="text-lg font-black uppercase text-white tracking-tight italic truncate">
                                                            {booking.show?.theater || 'Main Screen'}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2 relative">
                                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-2">
                                                            <Ticket className="w-3 h-3" /> Reserved Seats
                                                        </p>
                                                        <p className="text-lg font-black uppercase text-primary tracking-tight italic">
                                                            {booking.bookedSeats.join(', ')}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <button
                                                        onClick={() => setViewingBooking(booking)}
                                                        className="flex-1 bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-primary hover:text-white transition-all duration-500"
                                                    >
                                                        <Eye className="w-4 h-4" /> Unlock Digital Pass
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Are you sure you want to remove this booking record?')) {
                                                                removeBooking(booking._id)
                                                            }
                                                        }}
                                                        className="px-8 py-5 glass-card rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border-none group/del"
                                                    >
                                                        <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Past Section */}
                {pastBookings.length > 0 && (
                    <div className="mt-32">
                        <div className="flex items-center gap-6 mb-12">
                            <Clock className="text-gray-700 w-5 h-5" />
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-gray-700">Cinematic History</h2>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 to-transparent"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pastBookings.map((booking) => (
                                <div key={booking._id} className="glass-card rounded-[2.5rem] p-6 border-white/5 opacity-60 hover:opacity-100 transition-all duration-700 group grayscale hover:grayscale-0">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-32 rounded-2xl overflow-hidden border border-white/5">
                                            <img 
                                               src={getPosterUrl(booking.show?.movie?.poster_path)} 
                                               alt="" 
                                               onError={handleImageError} 
                                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-white uppercase tracking-tight text-lg mb-1 truncate">{booking.show?.movie?.title || 'Unknown Movie'}</h3>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-4">
                                                Watched on {new Date(booking.show.showDateTime).toLocaleDateString()}
                                            </p>
                                            <button
                                                onClick={() => removeBooking(booking._id)}
                                                className="text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 className="w-3 h-3" /> Archive Record
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Discover */}
                <div className="mt-32 border-t border-white/5 pt-20 flex flex-col items-center">
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-8">Eager for more cinema?</p>
                    <Link to="/movies" className="glass-card px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs flex items-center gap-6 hover:border-primary transition-all group">
                        Discover New Premireres <ShoppingBag className="w-4 h-4 text-primary group-hover:scale-125 transition-transform" />
                    </Link>
                </div>
            </div>

            <AnimatePresence>
                {viewingBooking && (
                    <TicketWallet
                        booking={viewingBooking}
                        onClose={() => setViewingBooking(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default MyBookings
