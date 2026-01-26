import React from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, Users, Film, Calendar, TrendingUp } from 'lucide-react'

const AdminDashboard = () => {
  const stats = {
    totalBookings: 42,
    totalRevenue: 25000,
    activeShows: 3,
    totalUsers: 120
  }

  const recentBookings = [
    { id: 'b001', user: 'John Doe', movie: 'Moda Tharindu', seats: 2, amount: 1600, status: 'confirmed' },
    { id: 'b002', user: 'Jane Smith', movie: 'Father', seats: 4, amount: 3200, status: 'pending' },
    { id: 'b003', user: 'Bob Johnson', movie: 'Neera', seats: 2, amount: 1600, status: 'confirmed' },
  ]

  const getStatusColor = (status) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-800'
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Link to="/admin/movies/add" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Film size={20} />Add Movie
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Total Bookings</p><p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalBookings}</p></div>
            <div className="bg-blue-500 p-3 rounded-lg"><Calendar size={24} className="text-white" /></div>
          <div className="flex items-center gap-1 mt-4 text-green-600 text-sm"><TrendingUp size={16} /><span>+12% from last week</span></div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Total Revenue</p><p className="text-2xl font-bold text-gray-800 mt-1">Rs. {stats.totalRevenue.toLocaleString()}</p></div>
            <div className="bg-green-500 p-3 rounded-lg"><DollarSign size={24} className="text-white" /></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Active Shows</p><p className="text-2xl font-bold text-gray-800 mt-1">{stats.activeShows}</p></div>
            <div className="bg-purple-500 p-3 rounded-lg"><Film size={24} className="text-white" /></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Total Users</p><p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p></div>
            <div className="bg-orange-500 p-3 rounded-lg"><Users size={24} className="text-white" /></div>
        </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Movie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.movie}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.seats}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Rs. {booking.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default AdminDashboard
