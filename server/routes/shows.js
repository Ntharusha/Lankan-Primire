const express = require('express');
const router = express.Router();
const Show = require('../models/Show');
const Theater = require('../models/Theater');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
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

// Get seat popularity heatmap for a show
router.get('/:id/heatmap', async (req, res) => {
    try {
        console.log(`🔥 Heatmap Request for Show ID: ${req.params.id}`);
        const show = await Show.findById(req.params.id).populate('theater');
        
        if (!show) {
            console.log(`❌ Show ${req.params.id} not found for heatmap`);
            return res.status(404).json({ message: 'Show not found' });
        }

        console.log(`📍 Found Show. Theater populated: ${!!show.theater}`);
        const theaterName = show.theater ? (show.theater.name || show.theater) : null;
        console.log(`🎭 Target Theater Name: ${theaterName}`);

        if (!theaterName) {
            console.log('⚠️ No theater name found. Returning empty heatmap.');
            return res.json({ seatPopularity: {}, maxCount: 0 });
        }

        // Find all confirmed bookings for this theater to calculate historic popularity
        const bookings = await Booking.find({ 
            'show.theater': theaterName,
            status: 'confirmed'
        });

        console.log(`📊 Found ${bookings.length} historic confirmed bookings for theater: ${theaterName}`);

        const seatPopularity = {};
        let maxCount = 0;

        bookings.forEach(booking => {
            if (booking.bookedSeats && Array.isArray(booking.bookedSeats)) {
                booking.bookedSeats.forEach(seat => {
                    seatPopularity[seat] = (seatPopularity[seat] || 0) + 1;
                    if (seatPopularity[seat] > maxCount) maxCount = seatPopularity[seat];
                });
            }
        });

        res.json({ seatPopularity, maxCount });
    } catch (error) {
        console.error("📛 Heatmap API Error:", error);
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

// Update a show (admin)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const show = await Show.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('movie').populate('theater');

        if (!show) return res.status(404).json({ message: 'Show not found' });
        res.json(show);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a show (admin)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const show = await Show.findByIdAndDelete(req.params.id);
        if (!show) return res.status(404).json({ message: 'Show not found' });
        res.json({ message: 'Show deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
