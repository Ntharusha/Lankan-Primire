import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Clock, Trash2, ChevronRight, Sparkles } from 'lucide-react'
import { getPosterUrl, handleImageError } from '../utils/movieUtils'
import { useFavourites } from '../context/FavouriteContext'
import { motion, AnimatePresence } from 'framer-motion'

const Favourite = () => {
  const { favourites, removeFavourite } = useFavourites()

  if (favourites.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center mb-8 border border-white/5">
            <Heart className="w-16 h-16 text-gray-700" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">No Favourites Yet</h1>
          <p className="text-gray-500 max-w-sm font-medium mb-12 leading-relaxed">
            Discover Sinhala cinema and heart the movies you love to revisit later.
          </p>
          <Link to="/movies" className="btn-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm">
            Discover Movies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Your Watchlist</span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">My <span className="text-gradient">Favourites</span></h1>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
            {favourites.length} movie{favourites.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence>
            {favourites.map((movie, index) => (
              <motion.div
                key={movie._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-[2rem] overflow-hidden group relative"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                  {/* Rating */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-white text-[10px] font-black">{movie.vote_average?.toFixed(1)}</span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFavourite(movie._id)}
                    className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-red-600 rounded-xl transition-all border border-white/10 hover:border-red-500"
                    title="Remove from favourites"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>

                  {/* Hover CTA */}
                  <div className="absolute bottom-3 left-3 right-3 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Link
                      to={`/movies/${movie._id}`}
                      className="btn-primary text-white text-center py-2.5 rounded-xl text-xs font-black uppercase tracking-widest block"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors mb-1">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{movie.runtime}m</span>
                    <span className="text-gray-700">|</span>
                    <span className="truncate">{movie.genres?.[0]?.name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-20 flex justify-center">
          <Link to="/movies" className="glass-card px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:border-primary/30 transition-all group">
            Discover More <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Favourite