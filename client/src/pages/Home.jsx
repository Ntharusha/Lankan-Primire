import React, { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import MoodFilter from '../components/MoodFilter'
import RecentlyViewedCarousel from '../components/RecentlyViewedCarousel'
import VibeQuiz from '../components/VibeQuiz'
import { getAllMovies } from '../services/movieService'
import { Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const Home = () => {
  const [selectedMood, setSelectedMood] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQuiz, setShowQuiz] = useState(false)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getAllMovies()
        setMovies(data.filter(m => m.isShowing))
      } catch (error) {
        console.error("Failed to fetch movies:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-nebula-deep flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="bg-nebula-deep min-h-screen">
      <HeroSection movie={movies[0]} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 -mt-20 relative z-20">
        <div className="glass-card rounded-[3rem] p-8 md:p-12 border-white/5">
          <MoodFilter onMoodSelect={setSelectedMood} />
        </div>
      </div>

      <FeaturedSection selectedMood={selectedMood} movies={movies} />

      <RecentlyViewedCarousel />

      {/* Floating Vibe Quiz Trigger */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQuiz(true)}
        className="fixed bottom-10 right-10 z-[100] w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/40 group border border-white/20"
      >
        <Sparkles className="w-8 h-8 text-white group-hover:animate-pulse" />
        <div className="absolute -top-12 right-0 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl italic">
          What's your vibe?
        </div>
      </motion.button>

      <AnimatePresence>
        {showQuiz && (
          <VibeQuiz movies={movies} onClose={() => setShowQuiz(false)} />
        )}
      </AnimatePresence>

      {/* Decorative Gradient */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-nebula-accent/5 blur-[150px] -z-10 rounded-full"></div>
    </div>
  )
}

export default Home
