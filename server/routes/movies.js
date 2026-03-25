const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const { auth, admin } = require('../middleware/auth');

// AI Recommendations: "The Director's Cut"
router.get('/recommendations', auth, async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ message: 'Unauthorized' });

    // 1. Get user's past bookings to find preferences
    const bookings = await Booking.find({ 'user.email': userEmail }).populate('show.movie');
    
    let preferredGenres = new Set();
    let preferredMoods = new Set();
    let bookedMovieIds = new Set();

    bookings.forEach(b => {
      if (b.show?.movie) {
        bookedMovieIds.add(b.show.movie._id.toString());
        b.show.movie.genres?.forEach(g => preferredGenres.add(g.name));
        b.show.movie.moodTags?.forEach(m => preferredMoods.add(m));
      }
    });

    let recommendedMovies = [];

    if (preferredGenres.size > 0 || preferredMoods.size > 0) {
      // Find movies that match preferred genres or moods and haven't been booked
      recommendedMovies = await Movie.find({
        $and: [
          { _id: { $nin: Array.from(bookedMovieIds) } },
          { isShowing: true },
          {
            $or: [
              { 'genres.name': { $in: Array.from(preferredGenres) } },
              { moodTags: { $in: Array.from(preferredMoods) } }
            ]
          }
        ]
      }).limit(10).sort({ vote_average: -1 });
    }

    // Fallback if no specific recommendations found
    if (recommendedMovies.length < 3) {
      const fallback = await Movie.find({
        _id: { $nin: Array.from(bookedMovieIds) },
        isShowing: true
      }).limit(10 - recommendedMovies.length).sort({ vote_average: -1 });
      
      recommendedMovies = [...recommendedMovies, ...fallback];
    }

    res.json(recommendedMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all movies
router.get('/', async (req, res) => {
  try {
    const { search, genre, isShowing } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } }
      ];
    }

    if (genre) {
      query['genres.name'] = genre;
    }

    if (isShowing !== undefined) {
      query.isShowing = isShowing === 'true';
    }

    const movies = await Movie.find(query).sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create movie (admin)
router.post('/', auth, admin, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update movie (admin)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete movie (admin)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

