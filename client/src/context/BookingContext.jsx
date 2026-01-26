
import React, { createContext, useContext, useState, useEffect } from 'react'
import { dummyBookingData } from '../assets/assets'
import toast from 'react-hot-toast'

const BookingContext = createContext()

export const useBookings = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('myBookings')
    return saved ? JSON.parse(saved) : dummyBookingData
  })

  useEffect(() => {
    localStorage.setItem('myBookings', JSON.stringify(bookings))
  }, [bookings])

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      _id: `BK${Date.now()}`,
      isPaid: true,
    }
    setBookings(prev => [...prev, newBooking])
    toast.success('Booking confirmed! Check My Bookings')
    return newBooking
  }

  const removeBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b._id !== bookingId))
    toast.success('Booking removed successfully')
  }

  const getUpcomingBookings = () => bookings.filter(b => b.isPaid)
  const getPastBookings = () => bookings.filter(b => !b.isPaid)

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      removeBooking,
      getUpcomingBookings,
      getPastBookings
    }}>
      {children}
    </BookingContext.Provider>
  )
}

