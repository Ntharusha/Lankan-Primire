/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import apiClient from '../services/api'
import { useAuth } from './AuthContext'

const BookingContext = createContext()

export const useBookings = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([])

  const fetchBookings = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setBookings([])
      return
    }
    try {
      const data = await apiClient.get('/bookings/my')
      setBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch bookings from server', error)
      setBookings([])
    }
  }

  const { user } = useAuth()

  useEffect(() => {
    fetchBookings()
    // Re-fetch whenever the logged-in user changes (login / logout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    localStorage.setItem('myBookings', JSON.stringify(bookings))
  }, [bookings])

  const addBooking = async (booking) => {
    const payload = {
      ...booking,
      show: {
        ...booking.show,
        movie: booking.show.movie?._id || booking.show.movie
      }
    }

    try {
      const savedBooking = await apiClient.post('/bookings', payload)
      console.log('Booking saved to server', savedBooking)
      setBookings(prev => [...prev, savedBooking])
      toast.success('Booking confirmed! Check My Bookings')
      return savedBooking
    } catch (error) {
      console.error('Failed to save booking to server', error)
      const newBooking = {
        ...booking,
        _id: `BK${Date.now()}`,
        isPaid: true,
        createdAt: new Date().toISOString()
      }
      setBookings(prev => [...prev, newBooking])
      toast.success('Booking confirmed locally! Check My Bookings')

      // Retry in background to sync with server when available
      setTimeout(async () => {
        try {
          const saved = await apiClient.post('/bookings', payload)
          // Replace the local fallback booking with the server-saved booking
          setBookings(prev => prev.map(b => (b._id === newBooking._id ? saved : b)))
          toast.success('Booking synced to server')
          console.log('Retried booking synced to server', saved)
        } catch (err) {
          // keep failing silently; will be retried next session on fetch
          console.warn('Background retry to sync booking failed', err)
        }
      }, 10000)

      return newBooking
    }
  }

  const removeBooking = async (bookingId) => {
    try {
      await apiClient.delete(`/bookings/${bookingId}`)
    } catch (error) {
      // If server delete fails, still remove locally so UX is responsive
      console.warn('Server delete failed, removing locally only', error)
    }
    setBookings(prev => prev.filter(b => b._id !== bookingId))
    toast.success('Booking removed successfully')
  }

  const now = new Date()
  const getUpcomingBookings = () =>
    bookings.filter(b => b.isPaid && new Date(b.show?.showDateTime) >= now)
  const getPastBookings = () =>
    bookings.filter(b => !b.isPaid || new Date(b.show?.showDateTime) < now)

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

