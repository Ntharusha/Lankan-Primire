import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../services/api'
import {
  DollarSign,
  Users,
  Film,
  Calendar,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Activity,
  Sparkles,
  BarChart2
} from 'lucide-react'
import { motion } from 'framer-motion'
import socket from '../services/socket'
import toast from 'react-hot-toast'

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
    const fetchStats = async () => {
      try {
        const data = await apiClient.get('/bookings/stats/dashboard')
        setStats({
          totalBookings: data.totalBookings || 0,
          totalRevenue: data.totalRevenue || 0,
          activeShows: data.activeShows || 0,
          totalUsers: data.totalUsers || 0
        })
        setRecentBookings(data.recentBookings || [])
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error)
        // Fallback removed for cleaner logic
      } finally {
        setLoading(false)
      }
    }
    fetchStats()

    // Real-time updates
    socket.on('booking_completed', (data) => {
      toast.success(`New booking received: #${data._id.slice(-6)}`, {
        icon: '💰',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      fetchStats();
    });

    return () => {
      socket.off('booking_completed');
    }
  }, [])

  const statCards = [
    { title: 'Gross Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-emerald-600', trend: '+18%' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-primary to-pink-600', trend: '+12%' },
    { title: 'Active Shows', value: stats.activeShows, icon: Film, color: 'from-blue-500 to-indigo-600', trend: '+5%' },
    { title: 'Cinema Patrons', value: stats.totalUsers, icon: Users, color: 'from-orange-500 to-amber-600', trend: '+24%' },
  ]

  const chartData = [
    { day: 'Mon', revenue: 45000 },
    { day: 'Tue', revenue: 52000 },
    { day: 'Wed', revenue: 38000 },
    { day: 'Thu', revenue: 65000 },
    { day: 'Fri', revenue: 89000 },
    { day: 'Sat', revenue: 120000 },
    { day: 'Sun', revenue: 105000 },
  ]
  const maxRevenue = Math.max(...chartData.map(d => d.revenue))

  if (loading) return <div className="p-24 text-center text-primary font-black animate-pulse">Initializing Command Center...</div>

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">System Overview</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Admin <span className="text-gradient">Dashboard</span></h1>
        </div>

        <div className="flex gap-4">
          <Link to="/admin/movies" className="glass-card px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:border-primary/30 transition-all">
            <Film className="w-4 h-4 text-primary" /> Manage Movies
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index}
            className="glass-card p-8 rounded-[2rem] relative overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${stat.color}`}></div>
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} /> {stat.trend}
              </div>
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.title}</p>
            <p className="text-3xl font-black text-white tracking-tighter italic">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-8 glass-card rounded-[2.5rem] overflow-hidden border-white/5 flex flex-col">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Live <span className="text-primary">Transactions</span></h2>
            <Link to="/admin/bookings" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">See All Activity</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-white/[0.01]">
                  <th className="px-8 py-6 text-left">Reference</th>
                  <th className="px-8 py-6 text-left">Patron</th>
                  <th className="px-8 py-6 text-left">Feature</th>
                  <th className="px-8 py-6 text-left">Revenue</th>
                  <th className="px-8 py-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap text-xs font-black text-gray-500 tracking-widest">#{booking._id}</td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <p className="text-sm font-black text-white group-hover:text-primary transition-colors">{booking.user.name}</p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <p className="text-sm font-bold text-gray-400">{booking.show?.movie?.title}</p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <p className="text-sm font-black text-nebula-accent italic">Rs. {booking.amount}</p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Quick Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-black uppercase tracking-tighter">Growth Optimization</h3>
            </div>
            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
              Based on current trends, we recommend increasing showtimes for <span className="text-white font-bold italic">"Moda Tharindu"</span> by <span className="text-primary font-bold">15%</span> to maximize weekend revenue.
            </p>
            <div className="border-t border-white/5 pt-6">
              <button className="w-full btn-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Generate Smart Report</button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-6">
              <BarChart2 className="w-5 h-5 text-purple-400" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">7-Day Revenue</h3>
            </div>
            <div className="h-40 flex items-end justify-between gap-2 mt-4">
              {chartData.map((data, i) => {
                const heightPct = (data.revenue / maxRevenue) * 100
                return (
                  <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                    <div className="w-full relative flex items-end justify-center rounded-t-md overflow-hidden bg-white/5 h-32">
                      <div 
                        className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-sm transition-all duration-700 ease-out group-hover:from-nebula-accent/20 group-hover:to-nebula-accent"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{data.day}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
