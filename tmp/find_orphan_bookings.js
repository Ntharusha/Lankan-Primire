const mongoose = require('mongoose');
const Booking = require('./server/models/Booking');
const Movie = require('./server/models/Movie');
require('dotenv').config({ path: './server/.env' });

async function findOrphans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const bookings = await Booking.find();
    console.log(`Total bookings: ${bookings.length}`);
    for (const b of bookings) {
      if (b.show && b.show.movie) {
        const movie = await Movie.findById(b.show.movie);
        if (!movie) {
          console.log(`Orphaned Booking: ${b._id}, Movie ID: ${b.show.movie}, User: ${b.user.email}`);
        } else {
          console.log(`Healthy Booking: ${b._id}, Movie Title: ${movie.title}, User: ${b.user.email}`);
        }
      } else {
         console.log(`Booking with NO movie field: ${b._id}`);
      }
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

findOrphans();
