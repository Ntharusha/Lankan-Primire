
import React from 'react'
import NavBar from './components/NavBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favourite from './pages/Favourite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { BookingProvider } from './context/BookingContext'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminMovies from './pages/AdminMovies'
import AdminBookings from './pages/AdminBookings'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <BookingProvider>
      <Toaster />
      {!isAdminRoute && <NavBar />}
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/fav' element={<Favourite />} />

        {/* Admin Routes */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='movies' element={<AdminMovies />} />
          <Route path='bookings' element={<AdminBookings />} />
          <Route path='users' element={<div className="p-8 text-center text-gray-500">Users Management - Coming Soon</div>} />
          <Route path='settings' element={<div className="p-8 text-center text-gray-500">Settings - Coming Soon</div>} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </BookingProvider>
  )
}

export default App

