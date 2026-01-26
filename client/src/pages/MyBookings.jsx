
import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Ticket, ChevronRight, Download, Trash2, X } from 'lucide-react'
import { useBookings } from '../context/BookingContext'

const MyBookings = () => {
  const { bookings, removeBooking, getUpcomingBookings, getPastBookings } = useBookings()
  const upcomingBookings = getUpcomingBookings()
  const pastBookings = getPastBookings()

  const downloadTicket = (booking) => {
    alert(`Downloading ticket for booking ${booking._id}\nMovie: ${booking.show.movie.title}\nSeats: ${booking.bookedSeats.join(', ')}`)
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
          <div className="flex flex-col items-center justify-center py-20">
            <Ticket className="w-24 h-24 text-gray-700 mb-6" />
            <h2 className="text-2xl font-bold mb-2 text-gray-400">No Bookings Yet</h2>
            <p className="text-gray-500 mb-8">Start booking your favorite Sri Lankan movies!</p>
            <Link to="/movies" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all">
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">My Bookings</h1>
          <p className="text-gray-400">{bookings.length} bookings</p>
        </div>

        {upcomingBookings.length > 0 && (
          <div className="mb-12">
            <div className="border-l-4 border-red-600 pl-4 mb-6">
              <h2 className="text-2xl font-bold">Upcoming Bookings</h2>
              <p className="text-gray-400 text-sm">Your movie experience awaits</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-xl overflow-hidden border border-gray-700 relative group">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 aspect-[2/3] md:aspect-auto overflow-hidden">
                      <img src={booking.show.movie.poster_path} alt={booking.show.movie.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{booking.show.movie.title}</h3>
                          <p className="text-sm text-gray-400">Booking ID: {booking._id}</p>
                        </div>
                        <span className="bg-green-600/20 border border-green-600 text-green-500 px-3 py-1 rounded-full text-xs font-bold">CONFIRMED</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-red-600" />
                          <span>{new Date(booking.show.showDateTime).toLocaleDateString('si-LK')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-red-600" />
                          <span>{new Date(booking.show.showDateTime).toLocaleTimeString('si-LK', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-red-600" />
                          <span>Lankan Premiere</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Ticket className="w-5 h-5 text-red-600" />
                          <span>{booking.bookedSeats.join(', ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <div>
                          <p className="text-xs text-gray-400">Total Amount</p>
                          <p className="text-xl font-bold text-red-500">Rs. {booking.amount}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => downloadTicket(booking)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all">
                            <Download className="w-4 h-4" />Download
                          </button>
                          <button onClick={() => removeBooking(booking._id)} className="flex items-center gap-2 bg-gray-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all">
                            <Trash2 className="w-4 h-4" />Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pastBookings.length > 0 && (
          <div>
            <div className="border-l-4 border-gray-600 pl-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-400">Past Bookings</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {pastBookings.map((booking) => (
                <div key={booking._id} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 opacity-75 relative group">
                  <button onClick={() => removeBooking(booking._id)} className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 aspect-[2/3] md:aspect-auto overflow-hidden grayscale">
                      <img src={booking.show.movie.poster_path} alt={booking.show.movie.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold mb-2">{booking.show.movie.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">Booking ID: {booking._id}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{new Date(booking.show.showDateTime).toLocaleDateString('si-LK')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Ticket className="w-4 h-4" />
                          <span className="text-sm">{booking.bookedSeats.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/movies" className="inline-flex items-center bg-white/5 border border-white/10 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-all">
            Book More Movies
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MyBookings

