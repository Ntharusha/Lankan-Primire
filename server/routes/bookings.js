const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Show = require('../models/Show');
const User = require('../models/User');
const { sendBookingConfirmation, sendSplitInvite } = require('../services/notificationService');
const { auth, admin } = require('../middleware/auth');

// No fallback storage - system should be DB-driven for consistency

// Get all bookings (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('show.movie')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user's bookings
router.get('/my', auth, async (req, res) => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    if (!userEmail) return res.status(401).json({ message: 'Unauthorized' });
    const bookings = await Booking.find({ 'user.email': userEmail })
      .populate('show.movie')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings by date (authenticated)
router.get('/date/:date', auth, async (req, res) => {
  try {
    const startDate = new Date(req.params.date);
    const endDate = new Date(req.params.date);
    endDate.setDate(endDate.getDate() + 1);

    const bookings = await Booking.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate('show.movie');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create booking (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    // Normalize user email if present
    if (req.body.user && req.body.user.email) {
      req.body.user.email = req.body.user.email.toLowerCase();
    }

    // 0. Check for existing booking with same paymentIntentId to prevent double bookings (idempotency)
    if (req.body.paymentIntentId) {
      const existing = await Booking.findOne({ paymentIntentId: req.body.paymentIntentId });
      if (existing) {
        console.log('Returning existing booking to prevent duplication:', existing._id);
        return res.status(200).json(existing);
      }
    }

    // Ensure show.movie is an ObjectId referencing Movie.
    if (req.body?.show?.movie) {
      const moviePayload = req.body.show.movie
      // If moviePayload is an object with title or externalId, try to find or create
      if (typeof moviePayload === 'object') {
        let movieDoc = null
        if (moviePayload.externalId) {
          movieDoc = await Movie.findOne({ externalId: String(moviePayload.externalId) })
        }
        if (!movieDoc && moviePayload.title) {
          movieDoc = await Movie.findOne({ title: moviePayload.title })
        }
        if (!movieDoc) {
          movieDoc = new Movie({
            externalId: moviePayload.externalId ? String(moviePayload.externalId) : undefined,
            title: moviePayload.title || 'Untitled',
            poster_path: moviePayload.poster_path || '',
            backdrop_path: moviePayload.backdrop_path || '',
            release_date: moviePayload.release_date || '1970-01-01',
            overview: moviePayload.overview || moviePayload.title || 'No overview provided',
            titleSinhala: moviePayload.titleSinhala || moviePayload.title || 'N/A'
          })
          await movieDoc.save()
        }
        req.body.show.movie = movieDoc._id
      }
    }

    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    const populated = await savedBooking.populate('show.movie')
    console.log('Booking saved to DB', populated._id)

    // Update Show seats to unavailable
    const showId = req.body.show?.showId;
    if (showId) {
      const showDoc = await Show.findById(showId);
      if (showDoc) {
        const bookedSeats = req.body.bookedSeats || [];
        let changed = false;
        showDoc.seatGrid.forEach(row => {
          row.forEach(seat => {
            if (bookedSeats.includes(seat.seatNumber)) {
              seat.isAvailable = false;
              seat.isLocked = false;
              seat.lockedBy = null;
              changed = true;
            }
          });
        });
        if (changed) {
          showDoc.markModified('seatGrid');
          await showDoc.save();
          
          // Emit seat_unlocked (or seat_booked) to others so they see it's unavailable
          bookedSeats.forEach(seatNumber => {
            req.io.to(showId).emit('seat_unlocked', { showId, seatNumber });
          });

          console.log(`Updated Show ${showId} seats: ${bookedSeats.join(', ')}`);
        }
      }
    }

    // Award loyalty points to the user who made the booking
    if (req.user) {
      const pointsToAward = Math.floor(savedBooking.amount / 100);
      if (pointsToAward > 0) {
        await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: pointsToAward } });
        console.log(`🏆 Awarded ${pointsToAward} loyalty points to user ${req.user._id}`);
      }
    }

    // Notify admins of the new booking for live dashboard updates
    req.io.emit('booking_completed', populated);

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Update booking status (authenticated)
router.patch('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('show.movie');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel booking (authenticated)
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats (admin)
router.get('/stats/dashboard', auth, admin, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Active shows means unique movies currently scheduled
    const activeShowsCount = await Show.distinct('movie').then(movies => movies.length);
    const totalUsers = await User.countDocuments();

    const recentBookings = await Booking.find()
      .populate('show.movie')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeShows: activeShowsCount,
      totalUsers,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Split Payment Endpoints

// 1. Initiate split booking (authenticated)
router.post('/split', auth, async (req, res) => {
  try {
    const { user, show, bookedSeats, amount, friends } = req.body;

    // Create friends list with pending status
    const friendsList = friends.map(f => ({
      name: f.name,
      email: f.email?.toLowerCase(),
      amount: amount / (friends.length + 1),
      isPaid: false
    }));

    const booking = new Booking({
      user: {
        ...user,
        email: user.email?.toLowerCase()
      },
      show,
      bookedSeats,
      amount,
      isPaid: false,
      status: 'pending',
      splitPayment: {
        isSplit: true,
        primaryUser: {
          name: user.name,
          email: user.email?.toLowerCase(),
          amount: amount / (friends.length + 1),
          isPaid: false
        },
        friends: friendsList,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
      }
    });

    const savedBooking = await booking.save();

    // Send invites (async)
    savedBooking.splitPayment.friends.forEach(friend => {
      sendSplitInvite(savedBooking, friend);
    });

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. Pay share (simulated for a specific user/friend by email)
router.post('/split/:id/pay', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const booking = await Booking.findById(req.params.id);

    if (!booking || !booking.splitPayment.isSplit) {
      return res.status(404).json({ message: 'Split booking not found' });
    }

    if (new Date() > booking.splitPayment.expiresAt) {
      booking.status = 'expired';
      await booking.save();
      return res.status(400).json({ message: 'Payment window expired' });
    }

    let found = false;
    // Check primary user
    if (booking.splitPayment.primaryUser.email === email) {
      booking.splitPayment.primaryUser.isPaid = true;
      found = true;
    } else {
      // Check friends
      const friend = booking.splitPayment.friends.find(f => f.email === email);
      if (friend) {
        friend.isPaid = true;
        friend.paidAt = new Date();
        found = true;
      }
    }

    if (!found) {
      return res.status(404).json({ message: 'User not found in this split' });
    }

    // Check if everyone has paid
    const allPaid = booking.splitPayment.primaryUser.isPaid &&
      booking.splitPayment.friends.every(f => f.isPaid);

    if (allPaid) {
      booking.isPaid = true;
      booking.status = 'confirmed';

      // Award points to participants who have accounts
      try {
        const primaryUser = await User.findOne({ email: booking.splitPayment.primaryUser.email });
        if (primaryUser) {
          await User.findByIdAndUpdate(primaryUser._id, { 
            $inc: { loyaltyPoints: Math.floor(booking.splitPayment.primaryUser.amount / 100) } 
          });
        }
        for (const friend of booking.splitPayment.friends) {
          const friendUser = await User.findOne({ email: friend.email });
          if (friendUser) {
            await User.findByIdAndUpdate(friendUser._id, { 
              $inc: { loyaltyPoints: Math.floor(friend.amount / 100) } 
            });
          }
        }
        console.log(`🏆 Awarded split payment loyalty points for booking ${booking._id}`);
      } catch (err) {
        console.error("Failed to award split loyalty points:", err);
      }
      // Notify admins of the completed split booking
      req.io.emit('booking_completed', booking);
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
