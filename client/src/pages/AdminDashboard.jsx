import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  DollarSign, 
  Users, 
  Film, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: 0,
    totalUsers: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated data - replace with actual API call
    setStats({
      totalBookings: 42,
      totalRevenue: 25000,
      activeShows: 3,
      totalUsers: 120
    })
    setRecentBookings([
      { id: 'b001', user: 'John Doe', movie: 'Moda Tharindu', seats: 2, amount: 1600, status: 'confirmed' },
      { id: 'b002', user: 'Jane Smith', movie: 'Father', seats: 4, amount: 3200, status: 'pending' },
      { id: 'b003', user: 'Bob Johnson', movie: 'Neera', seats: 2, amount: 1600, status: 'confirmed' },
    ])
    setLoading(false)
  }, [])

  const statCards = [
    { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'bg-blue-500' },
    { title: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Active Shows', value: stats.activeShows, icon: Film, color: 'bg-purple-500' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-orange-500' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Link 
          to="/admin/movies/add" 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Film size={20} />
          Add Movie
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-green-600 text-sm">
              <TrendingUp size={16} />
              <span>+12% from last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                    <button className="text-red-600 hover:text-red-800">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Film size={40} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">Manage Movies</h3>
          <p className="text-blue-100 mb-4">Add, edit, or remove movies from the catalog</p>
          <Link to="/admin/movies" className="bg-white text-blue-600 px-4 py-2 rounded-lg inline-block hover:bg-blue-50 transition-colors">
            View All Movies
          </Link>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <Calendar size={40} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">View Bookings</h3>
          <p className="text-green-100 mb-4">Monitor and manage all bookings</p>
          <Link to="/admin/bookings" className="bg-white text-green-600 px-4 py-2 rounded-lg inline-block hover:bg-green-50 transition-colors">
            View Bookings
          </Link>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Users size={40} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">User Management</h3>
          <p className="text-purple-100 mb-4">View and manage registered users</p>
          <Link to="/admin/users" className="bg-white text-purple-600 px-4 py-2 rounded-lg inline-block hover:bg-purple-50 transition-colors">
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

