const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lankan-premiere'
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Continuing without DB connection — bookings will be stored in memory until DB is available.')
    // Do not exit; app can run in offline mode with fallback storage
  }
};

module.exports = connectDB;

