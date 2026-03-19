require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Route imports
const movieRoutes = require('./routes/movies');
const bookingRoutes = require('./routes/bookings');
const showRoutes = require('./routes/shows');
const userRoutes = require('./routes/users');
const { lockSeat, unlockSeat, unlockAllUserSeats, releaseExpiredLocks } = require('./services/showService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_show', (showId) => {
    socket.join(showId);
    console.log(`Socket ${socket.id} joined show ${showId}`);
  });

  socket.on('lock_seat', async (data) => {
    // data: { showId, seatNumber, userId }
    socket.userId = data.userId || socket.id; // Correctly track the ID used to lock
    try {
      await lockSeat(data.showId, data.seatNumber, socket.userId);
      socket.to(data.showId).emit('seat_locked', data);
    } catch (error) {
      socket.emit('error', { message: error.message, seatNumber: data.seatNumber });
    }
  });

  socket.on('unlock_seat', async (data) => {
    try {
      await unlockSeat(data.showId, data.seatNumber, data.userId || socket.id);
      socket.to(data.showId).emit('seat_unlocked', data);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', async () => {
    if (socket.userId) {
      try {
        await unlockAllUserSeats(socket.userId);
        console.log(`Unlocked all seats for user/socket: ${socket.userId}`);
      } catch (error) {
        console.error('Failed to unlock seats on disconnect:', error);
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

// Periodic cleanup of expired locks (every 2 minutes)
setInterval(async () => {
  try {
    await releaseExpiredLocks();
    console.log('Expired locks cleanup completed');
  } catch (error) {
    console.error('Failed to cleanup expired locks:', error);
  }
}, 2 * 60 * 1000);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
