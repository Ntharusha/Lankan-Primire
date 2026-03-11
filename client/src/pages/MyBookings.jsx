import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Ticket, ChevronRight, Eye, Trash2, X, Sparkles } from 'lucide-react'
import { useBookings } from '../context/BookingContext'
import TicketWallet from '../components/TicketWallet'
import { AnimatePresence, motion } from 'framer-motion'
import { getPosterUrl } from '../utils/movieUtils'

const MyBookings = () => {
  const { bookings, removeBooking, getUpcomingBookings, getPastBookings } = useBookings()
  const [viewingBooking, setViewingBooking] = useState(null)

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
  };

  const upcomingBookings = getUpcomingBookings()
  const pastBookings = getPastBookings()

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center mb-8 border border-white/5">
            <Ticket className="w-16 h-16 text-gray-700" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">No Bookings Found</h1>
          <p className="text-gray-500 max-w-sm font-medium mb-12 leading-relaxed">
            Your ticket wallet is currently empty. Discover the latest Sinhala cinema and secure your seats today!
          </p>
          <Link to="/movies" className="btn-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm">
            Discover Movies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Your Digital Wallet</span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">My <span className="text-gradient">Bookings</span></h1>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
            Total of {bookings.length} reservations
          </p>
        </div>

        {upcomingBookings.length > 0 && (
          <div className="mb-20">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-700 mb-8 flex items-center gap-4">
              Upcoming Shows
              <div className="h-px flex-1 bg-white/5"></div>
            </h2>

            <div className="grid grid-cols-1 gap-8">
              {upcomingBookings.map((booking, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={booking._id}
                  className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 relative group"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-72 aspect-[16/9] lg:aspect-auto overflow-hidden relative">
                      <img src={getPosterUrl(booking.show?.movie?.poster_path)} alt={booking.show?.movie?.title || ''} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-r from-nebula-deep/80 to-transparent"></div>
                    </div>

                    <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
                        <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors">{booking.show?.movie?.title || 'Unknown Movie'}</h3>
                          <div className="flex flex-wrap gap-4 items-center">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ID: {booking._id}</span>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Confirmed & Secured</span>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Paid</p>
                          <p className="text-2xl font-black text-white italic">Rs. {booking.amount}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Date</p>
                          <div className="flex items-center gap-2 text-white font-black uppercase text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            {new Date(booking.show.showDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Showtime</p>
                          <div className="flex items-center gap-2 text-white font-black uppercase text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            {new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Theater</p>
                          <div className="flex items-center gap-2 text-white font-black uppercase text-sm truncate">
                            <MapPin className="w-4 h-4 text-primary" />
                            {(booking.show?.theater || '').split(' ')[0]}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Seats</p>
                          <div className="flex items-center gap-2 text-white font-black uppercase text-sm">
                            <Ticket className="w-4 h-4 text-primary" />
                            {booking.bookedSeats.join(', ')}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => setViewingBooking(booking)}
                          className="flex-1 btn-primary py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
                        >
                          <Eye className="w-4 h-4" /> View Entry Pass
                        </button>
                        <button
                          onClick={() => removeBooking(booking._id)}
                          className="px-8 py-4 glass-card rounded-2xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all border-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-700 mb-8 flex items-center gap-4">
              Past Memories
              <div className="h-px flex-1 bg-white/5"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastBookings.map((booking) => (
                <div key={booking._id} className="glass-card rounded-[2rem] overflow-hidden border-white/5 opacity-50 hover:opacity-100 transition-opacity p-6 grayscale hover:grayscale-0 group">
                  <div className="flex items-center gap-6">
                    <img src={getPosterUrl(booking.show?.movie?.poster_path)} alt="" onError={handleImageError} className="w-20 h-28 object-cover rounded-xl" />
                    <div>
                      <h3 className="font-black text-white uppercase tracking-tight mb-2 truncate max-w-[150px]">{booking.show?.movie?.title || 'Unknown Movie'}</h3>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-4">
                        {new Date(booking.show.showDateTime).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => removeBooking(booking._id)}
                        className="text-xs font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" /> Clear Record
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <Link to="/movies" className="glass-card px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:border-primary/30 transition-all group">
            Continue Exploring <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
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
