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
    showId: {
      type: String, // Store show._id as string reference
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
  canteenOrder: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
  }],
  amount: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentIntentId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'online'],
    default: 'online',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'expired'],
    default: 'confirmed',
  },
  splitPayment: {
    isSplit: { type: Boolean, default: false },
    primaryUser: {
      name: String,
      email: String,
      amount: Number,
      isPaid: { type: Boolean, default: false }
    },
    friends: [{
      name: String,
      email: String,
      amount: Number,
      isPaid: { type: Boolean, default: false },
      paidAt: Date
    }],
    expiresAt: Date // 15-minute window for all to pay
  },
  bookingTimer: {
    type: Date, // For the 10-minute hold
    default: () => new Date(+new Date() + 10 * 60 * 1000)
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);

