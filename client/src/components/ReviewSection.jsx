import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, MessageSquare, Trash2, Send, User } from 'lucide-react'
import apiClient from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const ReviewSection = ({ movieId }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const data = await apiClient.get(`/reviews/movie/${movieId}`)
      setReviews(data)
    } catch (error) {
      console.error('Failed to fetch reviews', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to leave a review')
      return
    }

    setSubmitting(true)
    try {
      await apiClient.post('/reviews', { movie: movieId, rating, comment })
      toast.success('Review submitted! ❤️')
      setComment('')
      setRating(5)
      fetchReviews()
    } catch (error) {
      toast.error(error.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await apiClient.delete(`/reviews/${id}`)
        setReviews(reviews.filter(r => r._id !== id))
        toast.success('Review removed')
      } catch {
        toast.error('Failed to delete review')
      }
    }
  }

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center gap-3 border-l-4 border-red-600 pl-4">
        <MessageSquare className="w-6 h-6 text-red-600" />
        <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
          Patron <span className="text-red-600">Reviews</span>
          <span className="text-xs font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full not-italic tracking-widest">
            {reviews.length} total
          </span>
        </h3>
      </div>

      {/* Review Form */}
      {user ? (
        <div className="glass-card rounded-[2rem] p-8 border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 mr-2">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-125 group"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-700 group-hover:text-yellow-500/50 transition-colors'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your cinema experience..."
                required
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[120px] text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-red-600/50 transition-all text-sm font-medium leading-relaxed resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full md:w-auto px-10 py-4 rounded-xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 group shadow-lg shadow-red-600/20"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      ) : (
        <div className="glass-card rounded-[2rem] p-8 border-dashed border-white/10 text-center">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">Want to share your thoughts?</p>
          <Link to="/login" className="btn-primary text-white px-10 py-4 rounded-xl inline-block font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/20">
            Sign In to Review
          </Link>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {reviews.length > 0 ? (
            reviews.map((rev, index) => (
              <motion.div
                key={rev._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-[2.5rem] p-8 border-white/5 hover:bg-white/[0.02] transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600/20 group-hover:bg-red-600 transition-colors"></div>
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/20 to-transparent flex items-center justify-center border border-red-600/20">
                      <User className="text-red-500 w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase tracking-tight italic text-sm">{rev.userName}</h4>
                      <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/20">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-yellow-500 text-[10px] font-black">{rev.rating} / 5</span>
                    </div>
                    {(user?._id === rev.user || user?.role === 'admin') && (
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-gray-400 leading-relaxed font-semibold text-sm italic italic-none">
                  “{rev.comment}”
                </p>
              </motion.div>
            ))
          ) : (
            !loading && (
              <div className="text-center py-20 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5">
                  <MessageSquare className="w-8 h-8 text-gray-700" />
                </div>
                <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-[10px]">No reviews yet. Be the first!</p>
              </div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ReviewSection
