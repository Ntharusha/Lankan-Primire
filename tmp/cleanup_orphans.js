const mongoose = require('mongoose');
const Booking = require('./server/models/Booking');
const Movie = require('./server/models/Movie');
require('dotenv').config({ path: './server/.env' });

async function cleanupOrphans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const bookings = await Booking.find();
    let count = 0;
    for (const b of bookings) {
      if (b.show && b.show.movie) {
        const movie = await Movie.findById(b.show.movie);
        if (!movie) {
          console.log(`Archiving orphaned booking: ${b._id} (Movie ID ${b.show.movie} not found)`);
          await Booking.findByIdAndDelete(b._id);
          count++;
        }
      }
    }
    console.log(`Cleanup complete. Removed ${count} orphaned bookings.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}

cleanupOrphans();
