const express = require('express');
const router = express.Router();
const Show = require('../models/Show');
const Theater = require('../models/Theater');
const Movie = require('../models/Movie');
const { auth, admin } = require('../middleware/auth');

// Get all shows
router.get('/', async (req, res) => {
    try {
        const shows = await Show.find().populate('movie').populate('theater');
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get shows for a specific movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const shows = await Show.find({ movie: req.params.movieId }).populate('theater');
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific show with seat layout
router.get('/:id', async (req, res) => {
    try {
        const show = await Show.findById(req.params.id).populate('movie').populate('theater');
        if (!show) return res.status(404).json({ message: 'Show not found' });
        res.json(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new show (admin)
router.post('/', auth, admin, async (req, res) => {
    try {
        const show = new Show(req.body);
        const savedShow = await show.save();
        res.status(201).json(savedShow);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
