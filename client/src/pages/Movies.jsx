
import React from 'react'
import { dummyShowsData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Star, Play, ChevronRight } from 'lucide-react'

const Movies = () => {
  return (
    <div className="bg-[#050905] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="border-l-4 border-red-600 pl-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">
              All <span className="text-red-600">Movies</span>
            </h2>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-gray-400">
            <span className="text-sm">{dummyShowsData.length} movies available</span>
          </div>
        </div>

        {/* Movie Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {dummyShowsData.map((movie, index) => (
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
                  src={movie.poster_path} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Play Button */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                  <div className="bg-red-600 rounded-full p-3 cursor-pointer hover:bg-red-700 transition-colors">
                    <Play className="w-6 h-6 text-white fill-current" />
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
                  <span className="truncate">{movie.genres[0]?.name}</span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {movie.genres.slice(0, 2).map((genre) => (
                    <span 
                      key={genre.id} 
                      className="bg-red-600/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Tagline */}
                <p className="text-gray-600 text-[9px] italic truncate mb-2">
                  "{movie.tagline}"
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
                  Movie {item}
                </h4>
                <p className="text-gray-500 text-[10px]">2025</p>
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

