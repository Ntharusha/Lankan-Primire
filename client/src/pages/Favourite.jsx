import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { dummyShowsData } from '../assets/assets'
import { Heart, Star, Clock, Trash2 } from 'lucide-react'

const Favourite = () => {
  // In a real app, this would come from a global state or API
  const [favourites, setFavourites] = useState(
    dummyShowsData.slice(0, 3).map(movie => movie._id)
  )

  const favouriteMovies = dummyShowsData.filter(movie => 
    favourites.includes(movie._id)
  )

  const removeFromFavourites = (movieId) => {
    setFavourites(prev => prev.filter(id => id !== movieId))
  }

  if (favouriteMovies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-red-600 fill-red-600" />
            <h1 className="text-4xl font-bold">My Favourites</h1>
          </div>
          
          <div className="flex flex-col items-center justify-center py-20">
            <Heart className="w-24 h-24 text-gray-700 mb-6" />
            <h2 className="text-2xl font-bold mb-2 text-gray-400">No Favourites Yet</h2>
            <p className="text-gray-500 mb-8">Start adding movies to your favourites!</p>
            <Link 
              to="/movies"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-600 fill-red-600" />
            <h1 className="text-4xl font-bold">My Favourites</h1>
          </div>
          <p className="text-gray-400">{favouriteMovies.length} movie{favouriteMovies.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favouriteMovies.map((movie) => (
            <div 
              key={movie._id} 
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-red-600/50 transition-all duration-300 group"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img 
                  src={movie.poster_path} 
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFromFavourites(movie._id)}
                  className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-red-600 rounded-full transition-all group/btn"
                  title="Remove from favourites"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-white text-xs font-bold">{movie.vote_average}</span>
                </div>

                {/* Book Button on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link 
                    to={`/movies/${movie._id}`}
                    className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg w-full text-center block font-bold transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">
                  {movie.title}
                </h3>
                
                <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {movie.runtime}m
                  </span>
                  <span>•</span>
                  <span>{movie.release_date}</span>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {movie.overview}
                </p>

                <div className="flex flex-wrap gap-2">
                  {movie.genres.slice(0, 3).map((genre) => (
                    <span 
                      key={genre.id}
                      className="bg-white/10 text-xs px-2 py-1 rounded-full text-gray-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Browse More */}
        <div className="text-center mt-12">
          <Link 
            to="/movies"
            className="inline-flex items-center bg-white/5 border border-white/10 hover:bg-red-600 hover:border-red-600 text-white px-8 py-3 rounded-full font-bold transition-all"
          >
            Add More Favourites
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Favourite