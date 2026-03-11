/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const FavouriteContext = createContext()

export const useFavourites = () => {
  const context = useContext(FavouriteContext)
  if (!context) throw new Error('useFavourites must be used within a FavouriteProvider')
  return context
}

export const FavouriteProvider = ({ children }) => {
  const { user } = useAuth()
  const [favourites, setFavourites] = useState([]) // list of movie objects

  // Load from localStorage keyed by user
  useEffect(() => {
    const key = user ? `favourites_${user._id || user.id}` : 'favourites_guest'
    const saved = localStorage.getItem(key)
    if (saved) {
      try { setFavourites(JSON.parse(saved)) } catch { setFavourites([]) }
    } else {
      setFavourites([])
    }
  }, [user])

  const persist = (list) => {
    const key = user ? `favourites_${user._id || user.id}` : 'favourites_guest'
    localStorage.setItem(key, JSON.stringify(list))
    setFavourites(list)
  }

  const isFavourite = (movieId) => favourites.some(m => m._id === movieId)

  const toggleFavourite = (movie) => {
    if (isFavourite(movie._id)) {
      persist(favourites.filter(m => m._id !== movie._id))
      toast('Removed from Favourites', { icon: '💔' })
    } else {
      persist([...favourites, movie])
      toast.success('Added to Favourites ❤️')
    }
  }

  const removeFavourite = (movieId) => {
    persist(favourites.filter(m => m._id !== movieId))
    toast('Removed from Favourites', { icon: '💔' })
  }

  return (
    <FavouriteContext.Provider value={{ favourites, isFavourite, toggleFavourite, removeFavourite }}>
      {children}
    </FavouriteContext.Provider>
  )
}
