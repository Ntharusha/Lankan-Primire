
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dummyShowsData } from '../assets/assets'
import { ChevronLeft, Monitor, Check } from 'lucide-react'
import { useBookings } from '../context/BookingContext'

const SeatLayout = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const movie = dummyShowsData.find((m) => m._id === id)
  const { addBooking } = useBookings()
  
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedShowtime, setSelectedShowtime] = useState('7:00 PM')
  const [selectedDate, setSelectedDate] = useState('2025-01-27')

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const seatsPerRow = 12
  const occupiedSeats = ['A5', 'A6', 'B7', 'C4', 'C5', 'D8', 'E3', 'F9', 'G6']

  const showtimes = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM']
  const dates = ['2025-01-27', '2025-01-28', '2025-01-29', '2025-01-30']

  const seatPrice = 800

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    )
  }

  const getSeatStatus = (seatId) => {
    if (occupiedSeats.includes(seatId)) return 'occupied'
    if (selectedSeats.includes(seatId)) return 'selected'
    return 'available'
  }

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat')
      return
    }
    
    const bookingData = {
      user: { name: 'Guest User' },
      show: {
        _id: `show_${id}_${selectedDate}`,
        movie: movie,
        showDateTime: `${selectedDate}T10:30:00.000Z`,
        showPrice: seatPrice,
      },
      amount: selectedSeats.length * seatPrice,
      bookedSeats: selectedSeats,
      isPaid: true,
    }
    
    addBooking(bookingData)
    navigate('/my-bookings')
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Movie not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="text-gray-400">Select your seats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Date</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedDate === date
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Showtime</h3>
              <div className="flex gap-3 flex-wrap">
                {showtimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedShowtime(time)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedShowtime === time
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex flex-col items-center mb-6">
                <div className="w-full max-w-2xl">
                  <div className="bg-gradient-to-b from-gray-700 to-gray-800 h-2 rounded-t-full mb-2"></div>
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <Monitor className="w-4 h-4" />
                    <span>SCREEN</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex flex-col items-center gap-3">
                  {rows.map((row) => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-6 text-center font-semibold text-gray-400">{row}</span>
                      <div className="flex gap-2">
                        {Array.from({ length: seatsPerRow }, (_, i) => {
                          const seatId = `${row}${i + 1}`
                          const status = getSeatStatus(seatId)
                          
                          return (
                            <button
                              key={seatId}
                              onClick={() => toggleSeat(seatId)}
                              disabled={status === 'occupied'}
                              className={`w-8 h-8 rounded-t-lg transition-all text-xs font-semibold flex items-center justify-center ${
                                status === 'available'
                                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                  : status === 'selected'
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-red-900/50 text-red-400 cursor-not-allowed'
                              }`}
                            >
                              {status === 'selected' && <Check className="w-4 h-4" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-700 rounded-t-lg"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600 rounded-t-lg"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-900/50 rounded-t-lg"></div>
                  <span>Occupied</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Movie</p>
                  <p className="font-semibold">{movie.title}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="font-semibold">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Showtime</p>
                  <p className="font-semibold">{selectedShowtime}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Selected Seats</p>
                  <p className="font-semibold">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Seats ({selectedSeats.length})</span>
                  <span>Rs. {selectedSeats.length * seatPrice}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-red-500">Rs. {selectedSeats.length * seatPrice}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0}
                className={`w-full py-4 rounded-lg font-bold transition-all ${
                  selectedSeats.length > 0
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatLayout

