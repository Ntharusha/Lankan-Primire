const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
        required: true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    currentPrice: {
        type: Number,
    },
    seatGrid: [[{
        seatNumber: String,
        category: {
            type: String,
            enum: ['Balcony', 'ODC', 'Box', 'Couple'],
            default: 'ODC'
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        isLocked: {
            type: Boolean,
            default: false
        },
        lockedBy: {
            type: String, // Session ID or User ID
            default: null
        },
        lockedAt: {
            type: Date,
            default: null
        }
    }]]
}, {
    timestamps: true,
});

// Calculate Dynamic Pricing before saving if availability is low
showSchema.pre('save', function (next) {
    if (this.isModified('seatGrid')) {
        const totalSeats = this.seatGrid.flat().length;
        const availableSeats = this.seatGrid.flat().filter(s => s.isAvailable && !s.isLocked).length;
        const occupancy = (totalSeats - availableSeats) / totalSeats;

        // DDP Logic: Increase price by 10% if occupancy > 90%
        if (occupancy >= 0.9) {
            this.currentPrice = this.basePrice * 1.1;
        } else {
            this.currentPrice = this.basePrice;
        }
    }
    next();
});

module.exports = mongoose.model('Show', showSchema);
