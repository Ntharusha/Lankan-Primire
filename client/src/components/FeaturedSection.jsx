import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, ChevronRight, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPosterUrl, handleImageError } from '../utils/movieUtils'

const FeaturedSection = ({ selectedMood, movies = [] }) => {
  // Filter movies based on moodTags
  const filteredMovies = selectedMood
    ? movies.filter(movie => movie.moodTags?.includes(selectedMood))
    : movies;

  return (
    <div className="py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Premium Curations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              {selectedMood ? `${selectedMood} ` : 'Featured '}
              <span className="text-gradient italic">Movies</span>
            </h2>
          </div>
          <Link to="/movies" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
            Explore All <ChevronRight className="w-4 h-4 text-primary" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={movie._id}
                  className="glass-card rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all duration-500"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={getPosterUrl(movie.poster_path)}
                      alt={movie.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-nebula-deep via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 glass-card px-3 py-1.5 rounded-xl flex items-center gap-2 border-none backdrop-blur-xl">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-white text-xs font-black">{movie.vote_average}</span>
                    </div>

                    {/* Quick Labels */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {movie.original_language === 'si' && (
                        <div className="glass-card px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary border-primary/20 bg-primary/5">
                          Sinhala
                        </div>
                      )}
                    </div>

                    {/* Book Button */}
                    <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <Link to={`/movies/${movie._id}`} className="btn-primary text-white py-4 rounded-2xl w-full text-center block text-xs font-black shadow-2xl tracking-widest uppercase">
                        Secure Seats
                      </Link>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-black text-white mb-2 truncate group-hover:text-primary transition-colors uppercase tracking-tight">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-primary" />
                        {movie.runtime}m
                      </span>
                      <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                      <span className="truncate text-nebula-accent">{movie.genres[0]?.name}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-500 font-bold uppercase tracking-widest">No movies found for this mood.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default FeaturedSection
