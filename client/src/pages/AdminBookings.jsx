
import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Film
} from 'lucide-react'

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setBookings([
      {
        _id: 'b001',
        user: { name: 'John Doe', email: 'john@example.com' },
        show: { 
          movie: { title: 'Moda Tharindu' },
          showDateTime: '2025-08-24T10:30:00.000Z'
        },
        bookedSeats: ['A1', 'A2'],
        amount: 1600,
        isPaid: true,
        status: 'confirmed'
      },
      {
        _id: 'b002',
        user: { name: 'Jane Smith', email: 'jane@example.com' },
        show: { 
          movie: { title: 'Father' },
          showDateTime: '2025-08-24T14:30:00.000Z'
        },
        bookedSeats: ['B1', 'B2', 'B3', 'B4'],
        amount: 3200,
        isPaid: false,
        status: 'pending'
      },
      {
        _id: 'b003',
        user: { name: 'Bob Johnson', email: 'bob@example.com' },
        show: { 
          movie: { title: 'Neera' },
          showDateTime: '2025-08-25T10:30:00.000Z'
        },
        bookedSeats: ['C1', 'C2'],
        amount: 1600,
        isPaid: true,
        status: 'confirmed'
      }
    ])
    setLoading(false)
  }, [])

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id.includes(searchTerm) ||
      booking.show.movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || booking.status === filter
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    const icons = {
      confirmed: <CheckCircle size={14} />,
      pending: <Clock size={14} />,
      cancelled: <XCircle size={14} />
    }
    return (
      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (date) => new Date(date).toLocaleDateString()
  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'confirmed').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800">Rs. {bookings.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Movie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Show Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#{booking._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">{booking.user.name}</p>
                        <p className="text-xs text-gray-500">{booking.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Film size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-800">{booking.show.movie.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(booking.show.showDateTime)}
                    </div>
                    <p className="text-xs text-gray-400">{formatTime(booking.show.showDateTime)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1 flex-wrap">
                      {booking.bookedSeats.map((seat) => (
                        <span key={seat} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Rs. {booking.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminBookings

