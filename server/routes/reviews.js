const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');

// Add a review
router.post('/', auth, async (req, res) => {
    try {
        const { movie, rating, comment } = req.body;
        const user = req.user._id;
        const userName = req.user.name;

        // Check if user already reviewed this movie
        const existing = await Review.findOne({ movie, user });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this movie' });
        }

        const review = new Review({ movie, user, userName, rating, comment });
        await review.save();

        // Recalculate movie average rating
        const reviews = await Review.find({ movie });
        const avg = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
        await Movie.findByIdAndUpdate(movie, { vote_average: avg, vote_count: reviews.length });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const reviews = await Review.find({ movie: req.params.movieId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const movieId = review.movie;
        await Review.findByIdAndDelete(req.params.id);

        // Update average
        const reviews = await Review.find({ movie: movieId });
        const avg = reviews.length > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;
        await Movie.findByIdAndUpdate(movieId, { vote_average: avg, vote_count: reviews.length });

        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
