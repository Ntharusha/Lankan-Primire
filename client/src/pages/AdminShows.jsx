import React, { useState, useEffect } from 'react'
import apiClient from '../services/api'
import toast from 'react-hot-toast'
import { Film, Plus, Clock, MapPin, Trash2, Calendar, DollarSign, Loader2, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPosterUrl, handleImageError } from '../utils/movieUtils'

const generateSeatGrid = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const seatsPerRow = 12
  return rows.map(row =>
    Array.from({ length: seatsPerRow }, (_, i) => ({
      seatNumber: `${row}${i + 1}`,
      category: row <= 'B' ? 'Balcony' : row <= 'F' ? 'ODC' : 'Box',
      isAvailable: true,
      isLocked: false,
      lockedBy: null,
      lockedAt: null
    }))
  )
}

const AdminShows = () => {
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const [theaters, setTheaters] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState({
    movie: '',
    theater: '',
    dateTime: '',
    basePrice: 800,
  })

  const fetchAll = async () => {
    try {
      const [showsData, moviesData] = await Promise.all([
        apiClient.get('/shows'),
        apiClient.get('/movies'),
      ])
      setShows(showsData)
      setMovies(moviesData.filter(m => m.isShowing))

      // Extract unique theaters from shows
      const theaterSet = {}
      showsData.forEach(s => {
        if (s.theater?._id) theaterSet[s.theater._id] = s.theater
      })
      setTheaters(Object.values(theaterSet))
    } catch (err) {
      console.error('Failed to load shows', err)
      toast.error('Failed to load shows')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.movie || !form.theater || !form.dateTime) {
      toast.error('Please fill all required fields')
      return
    }
    setSaving(true)
    try {
      const payload = {
        movie: form.movie,
        theater: form.theater,
        dateTime: new Date(form.dateTime).toISOString(),
        basePrice: Number(form.basePrice),
        seatGrid: generateSeatGrid()
      }
      const newShow = await apiClient.post('/shows', payload)
      setShows(prev => [newShow, ...prev])
      setShowModal(false)
      setForm({ movie: '', theater: '', dateTime: '', basePrice: 800 })
      toast.success('Show created successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to create show')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this show? All associated bookings may be affected.')) return
    try {
      await apiClient.delete(`/shows/${id}`)
      setShows(prev => prev.filter(s => s._id !== id))
      toast.success('Show deleted')
    } catch {
      toast.error('Failed to delete show')
    }
  }

  const filtered = shows.filter(s =>
    (s.movie?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.theater?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="p-24 text-center text-primary font-black animate-pulse uppercase tracking-[0.5em]">Loading Shows...</div>

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Film className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Showtime Management</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Manage <span className="text-gradient">Shows</span></h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3"
        >
          <Plus className="w-4 h-4" /> Schedule Show
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search by movie or theater..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full glass-card pl-16 pr-6 py-4 rounded-[2rem] border-white/5 outline-none font-bold text-sm placeholder-gray-600"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Shows', value: shows.length, color: 'text-primary' },
          { label: 'Upcoming', value: shows.filter(s => new Date(s.dateTime) > new Date()).length, color: 'text-green-500' },
          { label: 'Past Shows', value: shows.filter(s => new Date(s.dateTime) <= new Date()).length, color: 'text-gray-500' },
          { label: 'Movies', value: new Set(shows.map(s => s.movie?._id)).size, color: 'text-nebula-accent' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] text-center">
            <p className={`text-3xl font-black italic ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Shows Table */}
      <div className="glass-card rounded-[3rem] overflow-hidden border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-white/[0.01]">
                <th className="px-8 py-6 text-left">Movie</th>
                <th className="px-8 py-6 text-left">Theater</th>
                <th className="px-8 py-6 text-left">Date & Time</th>
                <th className="px-8 py-6 text-left">Price</th>
                <th className="px-8 py-6 text-left">Availability</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filtered.map(show => {
                  const totalSeats = show.seatGrid?.flat().length || 0
                  const availableSeats = show.seatGrid?.flat().filter(s => s.isAvailable).length || 0
                  const pct = totalSeats > 0 ? Math.round((availableSeats / totalSeats) * 100) : 0
                  const isPast = new Date(show.dateTime) <= new Date()
                  return (
                    <motion.tr
                      key={show._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`hover:bg-white/[0.02] transition-colors group ${isPast ? 'opacity-50' : ''}`}
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={getPosterUrl(show.movie?.poster_path)}
                            alt={show.movie?.title}
                            onError={handleImageError}
                            className="w-10 h-14 object-cover rounded-xl"
                          />
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight">{show.movie?.title || 'Unknown'}</p>
                            {isPast && <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Ended</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm font-bold text-gray-300">{show.theater?.name || 'N/A'}</span>
                        </div>
                        <p className="text-[10px] text-gray-600 ml-5">{show.theater?.location}</p>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {new Date(show.dateTime).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(show.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <p className="text-sm font-black text-primary italic">Rs. {show.basePrice}</p>
                        {show.currentPrice && show.currentPrice !== show.basePrice && (
                          <p className="text-[10px] text-yellow-500 font-bold">DDP: Rs. {show.currentPrice}</p>
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="w-24">
                          <div className="flex justify-between text-[10px] font-black mb-1">
                            <span className="text-gray-500">{availableSeats}/{totalSeats}</span>
                            <span className={pct > 50 ? 'text-green-500' : pct > 20 ? 'text-yellow-500' : 'text-red-500'}>{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(show._id)}
                          className="p-3 glass-card rounded-xl hover:text-red-500 hover:border-red-500/20 transition-colors border-none opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                    No shows found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Show Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-nebula-deep/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="glass-card w-full max-w-xl rounded-[3rem] p-10 relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-white text-2xl font-bold"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-8">Schedule <span className="text-gradient">New Show</span></h2>
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Movie *</label>
                  <select
                    required
                    value={form.movie}
                    onChange={e => setForm(p => ({ ...p, movie: e.target.value }))}
                    className="w-full glass-card px-5 py-3 rounded-2xl outline-none border-white/10 text-sm text-white"
                  >
                    <option value="">Select a movie...</option>
                    {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Theater *</label>
                  {theaters.length > 0 ? (
                    <select
                      required
                      value={form.theater}
                      onChange={e => setForm(p => ({ ...p, theater: e.target.value }))}
                      className="w-full glass-card px-5 py-3 rounded-2xl outline-none border-white/10 text-sm text-white"
                    >
                      <option value="">Select a theater...</option>
                      {theaters.map(t => <option key={t._id} value={t._id}>{t.name} — {t.location}</option>)}
                    </select>
                  ) : (
                    <input
                      required
                      placeholder="Theater ID (no theaters found in DB yet)"
                      value={form.theater}
                      onChange={e => setForm(p => ({ ...p, theater: e.target.value }))}
                      className="w-full glass-card px-5 py-3 rounded-2xl outline-none border-white/10 text-sm text-white placeholder-gray-600"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.dateTime}
                    onChange={e => setForm(p => ({ ...p, dateTime: e.target.value }))}
                    className="w-full glass-card px-5 py-3 rounded-2xl outline-none border-white/10 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Base Ticket Price (LKR) *</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={form.basePrice}
                    onChange={e => setForm(p => ({ ...p, basePrice: e.target.value }))}
                    className="w-full glass-card px-5 py-3 rounded-2xl outline-none border-white/10 text-sm text-white"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 glass-card py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-none hover:bg-white/5 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {saving ? 'Creating...' : 'Create Show'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminShows
