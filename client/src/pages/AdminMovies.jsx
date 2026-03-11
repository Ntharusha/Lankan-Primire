import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Film,
  Calendar,
  Clock,
  Star
} from 'lucide-react'
import { getPosterUrl, handleImageError } from '../utils/movieUtils'

const AdminMovies = () => {
  const { user } = useAuth()

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newMovie, setNewMovie] = useState({
    title: '',
    titleSinhala: '',
    overview: '',
    poster_path: '',
    backdrop_path: '',
    release_date: '',
    runtime: '',
    vote_average: '',
    isShowing: false
  })
  const [editingMovie, setEditingMovie] = useState(null)


  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const data = await apiClient.get('/movies')
      setMovies(data)
    } catch (error) {
      console.error('Failed to fetch movies', error)
      toast.error('Failed to load movies')
    } finally {
      setLoading(false)
    }
  }

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.titleSinhala?.includes(searchTerm)
  )

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await apiClient.delete(`/movies/${id}`)
        setMovies(movies.filter(m => m._id !== id))
        toast.success('Movie deleted successfully')
      } catch (error) {
        console.error('Failed to delete movie', error)
        toast.error('Failed to delete movie')
      }
    }
  }

  const handleAddMovie = async (e) => {
    e.preventDefault()
    try {
      const movieData = {
        ...newMovie,
        runtime: parseInt(newMovie.runtime),
        vote_average: parseFloat(newMovie.vote_average)
      }
      const addedMovie = await apiClient.post('/movies', movieData)
      setMovies([addedMovie, ...movies])
      setShowModal(false)
      setNewMovie({
        title: '',
        titleSinhala: '',
        overview: '',
        poster_path: '',
        backdrop_path: '',
        release_date: '',
        runtime: '',
        vote_average: '',
        isShowing: false
      })
      toast.success('Movie added successfully')
    } catch (error) {
      console.error('Failed to add movie', error)
      toast.error('Failed to add movie')
    }
  }

  const handleEditMovie = async (e) => {
    e.preventDefault()
    try {
      const movieData = {
        ...editingMovie,
        runtime: parseInt(editingMovie.runtime),
        vote_average: parseFloat(editingMovie.vote_average)
      }
      const updatedMovie = await apiClient.put(`/movies/${editingMovie._id}`, movieData)
      setMovies(movies.map(m => m._id === updatedMovie._id ? updatedMovie : m))
      setEditingMovie(null)
      toast.success('Movie updated successfully')
    } catch (error) {
      console.error('Failed to update movie', error)
      toast.error('Failed to update movie')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Info Debug */}
      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Logged in as:</strong> {user.name} ({user.email}) | <strong>Role:</strong> <span className={user.role === 'admin' ? 'text-green-600 font-bold' : 'text-red-600'}>{user.role || 'user'}</span>
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Movies</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Movie
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                onError={handleImageError}
                className="w-full h-48 object-cover"
              />
              {movie.isShowing ? (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Now Showing
                </span>
              ) : (
                <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{movie.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{movie.titleSinhala}</p>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{movie.overview}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {movie.release_date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {movie.runtime}m
                </span>
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} />
                  {movie.vote_average}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/admin/movies/${movie._id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm"
                >
                  <Eye size={16} />
                  View
                </Link>
                <button
                  onClick={() => setEditingMovie(movie)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(movie._id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <Film size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No movies found</p>
        </div>
      )}

      {/* Modal - Unified for Add and Edit */}
      {(showModal || editingMovie) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingMovie(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={editingMovie ? handleEditMovie : handleAddMovie} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Movie Title (English)</label>
                  <input
                    type="text"
                    required
                    value={editingMovie ? editingMovie.title : newMovie.title}
                    onChange={(e) => editingMovie
                      ? setEditingMovie({ ...editingMovie, title: e.target.value })
                      : setNewMovie({ ...newMovie, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Movie Title (Sinhala)</label>
                  <input
                    type="text"
                    required
                    value={editingMovie ? editingMovie.titleSinhala : newMovie.titleSinhala}
                    onChange={(e) => editingMovie
                      ? setEditingMovie({ ...editingMovie, titleSinhala: e.target.value })
                      : setNewMovie({ ...newMovie, titleSinhala: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                <textarea
                  required
                  rows="3"
                  value={editingMovie ? editingMovie.overview : newMovie.overview}
                  onChange={(e) => editingMovie
                    ? setEditingMovie({ ...editingMovie, overview: e.target.value })
                    : setNewMovie({ ...newMovie, overview: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL / Path</label>
                  <input
                    type="text"
                    required
                    value={editingMovie ? editingMovie.poster_path : newMovie.poster_path}
                    onChange={(e) => editingMovie
                      ? setEditingMovie({ ...editingMovie, poster_path: e.target.value })
                      : setNewMovie({ ...newMovie, poster_path: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backdrop URL / Path</label>
                  <input
                    type="text"
                    required
                    value={editingMovie ? editingMovie.backdrop_path : newMovie.backdrop_path}
                    onChange={(e) => editingMovie
                      ? setEditingMovie({ ...editingMovie, backdrop_path: e.target.value })
                      : setNewMovie({ ...newMovie, backdrop_path: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                  <input
                    type="date"
                    required
                    value={editingMovie ? (editingMovie.release_date?.split('T')[0]) : newMovie.release_date}
                    onChange={(e) => editingMovie
                      ? setEditingMovie({ ...editingMovie, release_date: e.target.value })
                      : setNewMovie({ ...newMovie, release_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Runtime (min)</label>
                  <input
                    type="number"
                    required
                    value={editingMovie ? editingMovie.runtime : newMovie.runtime}
                    onChange={(e) => editingMovie
                      ? setEditingMovie({ ...editingMovie, runtime: e.target.value })
                      : setNewMovie({ ...newMovie, runtime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingMovie ? editingMovie.vote_average : newMovie.vote_average}
                    onChange={(e) => editingMovie
                      ? setEditingMovie({ ...editingMovie, vote_average: e.target.value })
                      : setNewMovie({ ...newMovie, vote_average: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isShowing"
                  checked={editingMovie ? editingMovie.isShowing : newMovie.isShowing}
                  onChange={(e) => editingMovie
                    ? setEditingMovie({ ...editingMovie, isShowing: e.target.checked })
                    : setNewMovie({ ...newMovie, isShowing: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <label htmlFor="isShowing" className="text-sm text-gray-700">Currently Showing</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingMovie(null); }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-bold"
                >
                  {editingMovie ? 'Update Movie' : 'Add Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMovies

