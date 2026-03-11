
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
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminMovies from './pages/AdminMovies'
import AdminBookings from './pages/AdminBookings'
import AdminUsers from './pages/AdminUsers'
import AdminSettings from './pages/AdminSettings'
import AdminShows from './pages/AdminShows'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Theaters from './pages/Theaters'
import { FavouriteProvider } from './context/FavouriteContext'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <BookingProvider>
        <FavouriteProvider>
          <Toaster />
          {!isAdminRoute && <NavBar />}
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/movies/:id' element={<MovieDetails />} />
          <Route path='/theaters' element={<Theaters />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/fav' element={<Favourite />} />

          {/* User Protected Routes */}
          <Route path='/seat-layout/:id' element={
            <ProtectedRoute>
              <SeatLayout />
            </ProtectedRoute>
          } />
          <Route path='/my-bookings' element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path='/admin' element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path='movies' element={<AdminMovies />} />
            <Route path='shows' element={<AdminShows />} />
            <Route path='bookings' element={<AdminBookings />} />
            <Route path='users' element={<AdminUsers />} />
            <Route path='settings' element={<AdminSettings />} />
          </Route>
        </Routes>
        {!isAdminRoute && <Footer />}
        </FavouriteProvider>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App

