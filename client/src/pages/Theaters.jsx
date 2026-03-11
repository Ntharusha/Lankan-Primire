import React, { useState, useEffect } from 'react'
import { MapPin, Clock, Film, Star, ChevronRight, Ticket, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import apiClient from '../services/api'
import { motion } from 'framer-motion'

const theaterImages = [
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80',
  'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&q=80',
]

const Theaters = () => {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await apiClient.get('/shows')
        setShows(data)
      } catch (err) {
        console.error('Failed to fetch shows:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchShows()
  }, [])

  // Group shows by theater
  const theaterMap = {}
  shows.forEach(show => {
    const key = show.theater?._id || show.theater
    if (!key) return
    if (!theaterMap[key]) {
      theaterMap[key] = {
        theater: show.theater,
        shows: []
      }
    }
    theaterMap[key].shows.push(show)
  })
  const theaters = Object.values(theaterMap)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Cinema Network</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Our <span className="text-gradient">Theaters</span></h1>
          <p className="text-gray-500 mt-3 max-w-xl">Experience Sinhala cinema at its finest across our premium theater network in Sri Lanka.</p>
        </div>

        {theaters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6">
              <Film className="w-12 h-12 text-gray-700" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">No Theaters Listed Yet</h2>
            <p className="text-gray-500 mb-8">Shows haven't been scheduled. Check back soon!</p>
            <Link to="/movies" className="btn-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {theaters.map(({ theater, shows: theaterShows }, index) => (
              <motion.div
                key={theater?._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-[3rem] overflow-hidden group"
              >
                {/* Theater Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={theaterImages[index % theaterImages.length]}
                    alt={theater?.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nebula-deep via-nebula-deep/50 to-transparent" />
                  <div className="absolute bottom-6 left-8">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{theater?.name || 'Unknown Theater'}</h2>
                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest">{theater?.location}, {theater?.city || 'Sri Lanka'}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 glass-card px-3 py-1.5 rounded-xl flex items-center gap-2 border-primary/20">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Open</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-8">
                  <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                    <div className="text-center">
                      <p className="text-2xl font-black text-white">{theater?.totalSeats || 120}</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Seats</p>
                    </div>
                    <div className="text-center border-x border-white/5">
                      <p className="text-2xl font-black text-primary">{theaterShows.length}</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Shows</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <p className="text-2xl font-black text-white">4.8</p>
                      </div>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Rating</p>
                    </div>
                  </div>

                  {/* Upcoming Shows */}
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-600 mb-4">Upcoming Shows</h3>
                  <div className="space-y-3 mb-8">
                    {theaterShows.slice(0, 3).map(show => (
                      <Link
                        key={show._id}
                        to={`/seat-layout/${show._id}`}
                        className="flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.07] rounded-2xl border border-white/5 hover:border-primary/20 transition-all group/show"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-xl">
                            <Film className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight group-hover/show:text-primary transition-colors">
                              {show.movie?.title || 'Untitled'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-600" />
                              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                {new Date(show.dateTime).toLocaleDateString()} • {new Date(show.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-primary italic">Rs. {show.basePrice}</p>
                          <ChevronRight className="w-4 h-4 text-gray-600 ml-auto mt-1 group-hover/show:text-primary group-hover/show:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                    {theaterShows.length === 0 && (
                      <p className="text-center text-gray-600 text-xs py-4 font-bold uppercase tracking-widest">No upcoming shows</p>
                    )}
                  </div>

                  <Link
                    to="/movies"
                    className="w-full glass-card py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:border-primary/30 transition-all group/btn"
                  >
                    <Ticket className="w-4 h-4 text-primary" />
                    Book a Seat
                    <ChevronRight className="w-4 h-4 text-primary group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Features Banner */}
        <div className="mt-20 glass-card rounded-[3rem] p-12 text-center border-white/5">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Premium <span className="text-gradient">Cinema Experience</span></h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            All Lankan Premiere theaters offer Dolby Atmos sound, 4K laser projection, luxury seating, and our signature pre-order canteen service.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Dolby Atmos', '4K Laser', 'Luxury Seats', 'Canteen Pre-order'].map((f, i) => (
              <div key={i} className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                <p className="font-black text-white uppercase tracking-tight text-sm">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Theaters
