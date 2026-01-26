import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Eye, Film } from 'lucide-react'

const AdminMovies = () => {
  const [movies] = useState([
    { _id: '1', title: 'Moda Tharindu', titleSinhala: 'මෝඩ තරිඳු', overview: 'A compelling story', poster_path: 'https://img.youtube.com/vi/kPummbLKlts/hqdefault.jpg', release_date: '2025-08-22', runtime: 125, vote_average: 8.2, isShowing: true },
    { _id: '2', title: 'Father', titleSinhala: 'ෆාදර්', overview: 'A gripping dramatic film', poster_path: 'https://img.youtube.com/vi/wZq_svKB0KQ/hqdefault.jpg', release_date: '2025-09-05', runtime: 118, vote_average: 7.5, isShowing: true },
    { _id: '3', title: 'Neera', titleSinhala: 'නීරා', overview: 'A romantic tale', poster_path: 'https://img.youtube.com/vi/ztTmdYoNsxA/hqdefault.jpg', release_date: '2025-07-04', runtime: 130, vote_average: 7.9, isShowing: false },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newMovie, setNewMovie] = useState({ title: '', titleSinhala: '', overview: '', poster_path: '', release_date: '', runtime: '', vote_average: '', isShowing: false })

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) || movie.titleSinhala.includes(searchTerm)
  )

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      alert('Movie deleted (demo)')
    }
  }

  const handleAddMovie = (e) => {
    e.preventDefault()
    alert('Movie added (demo)')
    setShowModal(false)
    setNewMovie({ title: '', titleSinhala: '', overview: '', poster_path: '', release_date: '', runtime: '', vote_average: '', isShowing: false })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Movies</h1>
        <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />Add Movie
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search movies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={movie.poster_path} alt={movie.title} className="w-full h-48 object-cover" />
              {movie.isShowing ? (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">Now Showing</span>
              ) : (
                <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">Coming Soon</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{movie.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{movie.titleSinhala}</p>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{movie.overview}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>{movie.release_date}</span>
                <span>{movie.runtime}m</span>
                <span className="text-yellow-500">★ {movie.vote_average}</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/movies/${movie._id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm">
                  <Eye size={16} />View
                </Link>
                <Link to={`/admin/movies/edit/${movie._id}`} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm">
                  <Edit size={16} />Edit
                </Link>
                <button onClick={() => handleDelete(movie._id)} className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm">
                  <Trash2 size={16} />
                </button>
              </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Add New Movie</h2>
            </div>
            <form onSubmit={handleAddMovie} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Movie Title (English)</label>
                  <input type="text" required value={newMovie.title} onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Movie Title (Sinhala)</label>
                  <input type="text" required value={newMovie.titleSinhala} onChange={(e) => setNewMovie({...newMovie, titleSinhala: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                <textarea required rows="3" value={newMovie.overview} onChange={(e) => setNewMovie({...newMovie, overview: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
                <input type="url" required value={newMovie.poster_path} onChange={(e) => setNewMovie({...newMovie, poster_path: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                  <input type="date" required value={newMovie.release_date} onChange={(e) => setNewMovie({...newMovie, release_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Runtime (min)</label>
                  <input type="number" required value={newMovie.runtime} onChange={(e) => setNewMovie({...newMovie, runtime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input type="number" step="0.1" value={newMovie.vote_average} onChange={(e) => setNewMovie({...newMovie, vote_average: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isShowing" checked={newMovie.isShowing} onChange={(e) => setNewMovie({...newMovie, isShowing: e.target.checked})}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500" />
                <label htmlFor="isShowing" className="text-sm text-gray-700">Currently Showing</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">Add Movie</button>
              </div>
            </form>
          </div>
      )}
    </div>
  )
}

export default AdminMovies
