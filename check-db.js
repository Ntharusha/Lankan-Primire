const mongoose = require('mongoose');
const Booking = require('./server/models/Booking');
const Movie = require('./server/models/Movie');
require('dotenv').config({ path: './server/.env' });

async function checkBookings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lankan-premiere');
    console.log('Connected to MongoDB');
    const bookings = await Booking.find().populate('show.movie');
    console.log('Total bookings found:', bookings.length);
    bookings.forEach(b => {
      console.log(`Booking ID: ${b._id}, User: ${b.user.email}, isPaid: ${b.isPaid}, Amount: ${b.amount}`);
    });
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkBookings();
