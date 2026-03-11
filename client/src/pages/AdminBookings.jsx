import React, { useState, useEffect } from 'react'
import {
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Film,
  Filter,
  Download,
  Trash2
} from 'lucide-react'
import apiClient from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchBookings = async () => {
    try {
      const data = await apiClient.get('/bookings')
      setBookings(data)
    } catch (error) {
      console.error('Failed to load bookings', error)
      // Mock data for display
      setBookings([
        { _id: 'BK9283', user: { name: 'Pathum Nissanka', email: 'pathum@slc.lk' }, show: { movie: { title: 'Moda Tharindu' }, showDateTime: '2025-08-24T10:30:00.000Z' }, bookedSeats: ['A1', 'A2'], amount: 1600, status: 'confirmed', isPaid: true },
        { _id: 'BK9284', user: { name: 'Wanindu Hasaranga', email: 'wanindu@slc.lk' }, show: { movie: { title: 'Father' }, showDateTime: '2025-09-05T14:00:00.000Z' }, bookedSeats: ['B5', 'B6'], amount: 1600, status: 'pending', isPaid: false },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
    const interval = setInterval(fetchBookings, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return
    try {
      await apiClient.delete(`/bookings/${id}`)
      setBookings(bookings.filter(b => b._id !== id))
    } catch (error) {
      console.error('Failed to delete booking', error)
    }
  }

  const exportToCsv = () => {
    if (bookings.length === 0) return
    const headers = ['Record ID', 'Patron Name', 'Patron Email', 'Movie', 'Show Schedule', 'Seats', 'Revenue', 'Status']
    const csvContent = "data:text/csv;charset=utf-8," + 
      headers.join(",") + "\n" + 
      filteredBookings.map(b => (
        `${b._id},"${b.user?.name}","${b.user?.email}","${b.show?.movie?.title}",` +
        `"${new Date(b.show?.showDateTime).toLocaleString()}",` +
        `"${b.bookedSeats.join(' ')}",${b.amount},${b.status}`
      )).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `lankan_premiere_bookings_${new Date().toLocaleDateString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredBookings = bookings.filter(booking => {
    const name = booking.user?.name || ''
    const email = booking.user?.email || ''
    const movieTitle = booking.show?.movie?.title || ''
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id.includes(searchTerm) ||
      movieTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || booking.status === filter
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-500/10 text-green-500 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20'
    }
    return (
      <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    )
  }

  if (loading) return <div className="p-24 text-center text-primary font-black animate-pulse uppercase tracking-[0.5em]">Syncing Records...</div>

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Transaction History</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Manage <span className="text-gradient">Bookings</span></h1>
        </div>

        <div className="flex gap-4">
          <button onClick={exportToCsv} className="glass-card px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:border-primary/30 transition-all">
            <Download className="w-4 h-4 text-primary" /> Export Records
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by ID, Patron, or Feature..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-card pl-16 pr-6 py-5 rounded-[2rem] border-white/5 outline-none font-black uppercase text-xs tracking-widest placeholder:text-gray-700"
          />
        </div>

        <div className="lg:w-64 relative group">
          <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full glass-card pl-16 pr-6 py-5 rounded-[2rem] border-white/5 outline-none font-black uppercase text-xs tracking-widest appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-white/[0.01]">
                <th className="px-10 py-8 text-left">Record ID</th>
                <th className="px-10 py-8 text-left">Patron Info</th>
                <th className="px-10 py-8 text-left">Feature Details</th>
                <th className="px-10 py-8 text-left">Schedule</th>
                <th className="px-10 py-8 text-left">Revenue</th>
                <th className="px-10 py-8 text-left">Internal Status</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredBookings.map((booking) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={booking._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-10 py-8 whitespace-nowrap text-xs font-black text-gray-500 tracking-widest">#{booking._id}</td>
                    <td className="px-10 py-8 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight italic">{booking.user.name}</p>
                        <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">{booking.user.email}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-gray-300">{booking.show?.movie?.title}</p>
                        <div className="flex gap-1">
                          {booking.bookedSeats.map(seat => (
                            <span key={seat} className="text-[9px] font-black px-1.5 py-0.5 glass-card rounded border-primary/20 text-primary uppercase">{seat}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase">
                        <Calendar size={14} className="text-primary" />
                        {new Date(booking.show.showDateTime).toLocaleDateString()}
                      </div>
                      <p className="text-[10px] text-gray-600 font-bold mt-1 uppercase">{new Date(booking.show.showDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-10 py-8 whitespace-nowrap">
                      <p className="text-sm font-black text-nebula-accent italic">Rs. {booking.amount}</p>
                    </td>
                    <td className="px-10 py-8 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-10 py-8 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 glass-card rounded-xl hover:text-white transition-colors border-none" title="View Detail (Coming soon)">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDelete(booking._id)} className="p-3 glass-card rounded-xl hover:text-red-500 transition-colors border-none" title="Delete Booking">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const Eye = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
)

export default AdminBookings
