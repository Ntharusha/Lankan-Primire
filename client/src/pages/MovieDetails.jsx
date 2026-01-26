import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { dummyShowsData } from '../assets/assets'
import { Star, Clock, Calendar, ChevronRight } from 'lucide-react'

const MovieDetails = () => {
  const { id } = useParams()
  const movie = dummyShowsData.find((m) => m._id === id)

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Movie Not Found</h2>
          <Link to="/movies" className="text-red-600 hover:text-red-500">
            Back to Movies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Movie Backdrop */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(17,24,39,0.95) 40%, rgba(17,24,39,0.7) 60%, transparent 100%), linear-gradient(to top, rgba(17,24,39,1) 0%, transparent 50%), url(${movie.poster_path})`
          }}
        />
        
        <div className="relative z-10 h-full flex items-center px-8 md:px-32 pt-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="bg-red-600/20 border border-red-600 text-red-500 text-xs px-3 py-1 rounded-full font-semibold">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              {movie.title}
            </h1>
            
            <div className="flex items-center gap-6 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-lg">{movie.vote_average}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>{movie.release_date}</span>
              </div>
            </div>
            
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl">
              {movie.overview}
            </p>
            
            <Link 
              to={`/movies/${movie._id}/book`}
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-lg shadow-red-600/30 transition-all group"
            >
              Book Tickets
              <ChevronRight className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Movie Information Section */}
      <div className="px-8 md:px-32 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster Card */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl sticky top-24">
              <img 
                src={movie.poster_path} 
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-red-500">About the Movie</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                {movie.overview}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Release Date</p>
                  <p className="font-semibold">{movie.release_date}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Runtime</p>
                  <p className="font-semibold">{movie.runtime} minutes</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Rating</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {movie.vote_average}/10
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Genres</p>
                  <p className="font-semibold">{movie.genres.map(g => g.name).join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Book Tickets CTA */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to Watch?</h3>
              <p className="text-gray-200 mb-6">Book your tickets now and enjoy the experience!</p>
              <Link 
                to={`/movies/${movie._id}/book`}
                className="inline-flex items-center bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-all"
              >
                Select Showtime
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails