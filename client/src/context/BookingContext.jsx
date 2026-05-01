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
  const [bookings, setBookings] = useState(() => {
    // Initialize from localStorage for persistence of guest bookings
    const local = localStorage.getItem('myBookings')
    return local ? JSON.parse(local) : []
  })


  const fetchBookings = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      // If not logged in, only keep local guest bookings (BK...)
      setBookings(prev => prev.filter(b => b._id && b._id.toString().startsWith('BK')))
      return
    }
    try {
      const data = await apiClient.get('/bookings/my')
      const remoteBookings = Array.isArray(data) ? data : []
      
      // Merge remote and local (guest) bookings, prioritising server versions
      setBookings(prev => {
        const guestOnes = prev.filter(b => b._id && b._id.toString().startsWith('BK'))
        return [...remoteBookings, ...guestOnes]
      })
    } catch (error) {
      console.error('Failed to fetch bookings from server', error)
    }
  }

  const { user } = useAuth()

  useEffect(() => {
    fetchBookings()
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
          setBookings(prev => prev.map(b => (b._id === newBooking._id ? saved : b)))
          toast.success('Booking synced to server')
        } catch (err) {
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
      console.warn('Server delete failed, removing locally only', error)
    }
    setBookings(prev => prev.filter(b => b._id !== bookingId))
    toast.success('Booking removed successfully')
  }

  const getUpcomingBookings = () => {
    const now = new Date()
    return bookings.filter(b => b.isPaid && new Date(b.show?.showDateTime) >= now)
  }
  
  const getPastBookings = () => {
    const now = new Date()
    return bookings.filter(b => !b.isPaid || new Date(b.show?.showDateTime) < now)
  }

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      removeBooking,
      getUpcomingBookings,
      getPastBookings,
      refreshBookings: fetchBookings
    }}>
      {children}
    </BookingContext.Provider>
  )
}
