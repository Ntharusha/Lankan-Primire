const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    // In production/deployment (EC2), we should probably exit if DB connection fails
    if (process.env.NODE_ENV === 'production') {
      console.error('Exiting process due to DB connection failure in production.');
      process.exit(1);
    }
    
    console.error('Continuing in development mode with local fallback or in-memory storage simulation.');
  }
};

module.exports = connectDB;

