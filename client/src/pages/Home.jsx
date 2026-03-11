import React, { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import MoodFilter from '../components/MoodFilter'
import { getAllMovies } from '../services/movieService'

const Home = () => {
  const [selectedMood, setSelectedMood] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

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

      {/* Decorative Gradient */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-nebula-accent/5 blur-[150px] -z-10 rounded-full"></div>
    </div>
  )
}

export default Home
