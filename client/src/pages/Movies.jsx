import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getAllMovies } from '../services/movieService'
import { Calendar, Clock, Star, Play, ChevronRight } from 'lucide-react'
import { getPosterUrl, handleImageError } from '../utils/movieUtils'

const Movies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const location = useLocation()
  
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('search') || ''

  const genres = ['All', 'Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Sci-Fi']

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        const params = {
          search: searchQuery,
          isShowing: true,
          genre: activeFilter !== 'All' ? activeFilter : undefined
        }
        const data = await getAllMovies(params)
        setMovies(data)
      } catch (error) {
        console.error("Failed to fetch movies:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [searchQuery, activeFilter])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050905] flex items-center justify-center">
        <div className="w-24 h-24 relative">
          <div className="absolute inset-0 border-4 border-red-600/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-black text-red-600 animate-pulse uppercase tracking-widest">LKR</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#050905] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="border-l-4 border-red-600 pl-4">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
              Cinema <span className="text-red-600">Registry</span>
            </h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">
              Discover the latest in Sinhala Cinema
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveFilter(genre)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === genre 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        {(searchQuery || activeFilter !== 'All') && (
          <div className="mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-left duration-500">
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
              Showing {movies.length} matches for
            </span>
            {searchQuery && (
              <span className="bg-red-600/10 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-600/20">
                "{searchQuery}"
              </span>
            )}
            {activeFilter !== 'All' && (
              <span className="bg-red-600/10 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-600/20">
                {activeFilter}
              </span>
            )}
            <button 
              onClick={() => { setActiveFilter('All'); window.history.replaceState({}, '', '/movies'); }}
              className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest underline underline-offset-4 decoration-red-600/50"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Movie Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {movies.map((movie, index) => (
            <div
              key={movie._id}
              className="bg-[#121418] rounded-xl overflow-hidden border border-white/5 hover:border-red-600/30 transition-all duration-500 group relative"
            >
              {/* Number Badge */}
              <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {index + 1}
              </div>

              {/* Poster Image */}
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Play Button */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                  <div className="bg-red-600 rounded-full p-3 cursor-pointer hover:bg-red-700 transition-colors">
                    <Link to={`/movies/${movie._id}`}>
                      <Play className="w-6 h-6 text-white fill-current" />
                    </Link>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-white text-[10px] font-bold">{movie.vote_average}</span>
                </div>

                {/* Book Button on Overlay */}
                <div className="absolute bottom-3 left-0 right-0 px-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Link to={`/movies/${movie._id}`} className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg w-full text-center block text-xs font-bold shadow-lg">
                    BOOK NOW
                  </Link>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-3 bg-[#121418]">
                <h3 className="text-sm font-bold text-white mb-1 truncate group-hover:text-red-600 transition-colors">
                  {movie.title}
                </h3>

                <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-2">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {movie.runtime}m
                  </span>
                  <span className="text-gray-700">|</span>
                  <span className="truncate">{movie.genres && movie.genres[0]?.name}</span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {movie.genres && movie.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id || genre._id}
                      className="bg-red-600/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Tagline */}
                <p className="text-gray-600 text-[9px] italic truncate mb-2">
                  "{movie.tagline || 'Experience the magic'}"
                </p>

                {/* Mobile Book Button */}
                <Link
                  to={`/movies/${movie._id}`}
                  className="md:hidden w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  Get Tickets
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16">
          <div className="border-l-4 border-yellow-500 pl-4 mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
              Coming <span className="text-yellow-500">Soon</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-[#121418] rounded-xl p-3 hover:bg-[#1a1d24] transition-colors cursor-pointer text-center group border border-white/5 hover:border-yellow-500/30"
              >
                <div className="aspect-[2/3] bg-[#1a1d24] rounded-lg mb-3 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-600/20 to-gray-800 flex items-center justify-center">
                    <span className="text-2xl">🎬</span>
                  </div>
                </div>
                <h4 className="text-white font-semibold text-xs mb-1 group-hover:text-yellow-500 transition-colors truncate">
                  Coming Soon {item}
                </h4>
                <p className="text-gray-500 text-[10px]">2026</p>
                <span className="inline-block mt-2 bg-yellow-500/20 text-yellow-500 text-[9px] px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-600/20 via-[#121418] to-red-600/20 rounded-xl p-8 border border-white/5">
            <h4 className="text-xl font-bold text-white mb-2">
              Experience the Excellence of Sinhala Cinema!
            </h4>
            <p className="text-gray-400 text-sm">
              Visit our platform to get the latest movie updates
            </p>
            <Link
              to="/movies"
              className="inline-flex items-center mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Explore Movies
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Movies

