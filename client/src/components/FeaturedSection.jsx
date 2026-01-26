
import React from 'react'
import { dummyShowsData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { Star, Clock, ChevronRight } from 'lucide-react'

const FeaturedSection = () => {
  return (
    <div className="bg-[#050905] text-white py-16 px-4 md:px-8 lg:px-24">
      <div className="flex items-center justify-between mb-8">
        <div className="border-l-4 border-red-600 pl-4">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Featured <span className="text-red-600">Movies</span>
          </h2>
        </div>
        <Link to="/movies" className="flex items-center gap-1 text-gray-400 hover:text-red-600 transition-colors text-sm font-medium">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        {dummyShowsData.slice(0, 5).map((movie) => (
          <div 
            key={movie._id} 
            className="bg-[#121418] rounded-xl overflow-hidden border border-white/5 hover:border-red-600/30 transition-all duration-500 group"
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              <img 
                src={movie.poster_path} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              {/* Rating Badge */}
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/10">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-white text-[10px] font-bold">{movie.vote_average}</span>
              </div>
              
              {/* Book Button */}
              <div className="absolute bottom-3 left-0 right-0 px-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <Link to={`/movies/${movie._id}`} className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg w-full text-center block text-xs font-bold shadow-lg">
                  BOOK NOW
                </Link>
              </div>
            </div>
            
            <div className="p-3 bg-[#121418]">
              <h3 className="text-sm font-bold text-white mb-1 truncate group-hover:text-red-600 transition-colors">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {movie.runtime}m
                </span>
                <span className="text-gray-700">|</span>
                <span className="truncate">{movie.genres[0]?.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>          
  )
}

export default FeaturedSection

