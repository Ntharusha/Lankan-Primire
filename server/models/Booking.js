const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },
  show: {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    showDateTime: {
      type: Date,
      required: true,
    },
    theater: {
      type: String,
      required: true,
    },
    showPrice: {
      type: Number,
      required: true,
    },
  },
  bookedSeats: [{
    type: String,
    required: true,
  }],
  amount: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'online'],
    default: 'online',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);

