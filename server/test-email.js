const { sendBookingConfirmation } = require('./services/notificationService');
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

// Mock booking object for testing
const mockBooking = {
    _id: new mongoose.Types.ObjectId(),
    user: {
        name: 'Test Moviegoer',
        email: process.env.EMAIL_USER || 'ntb069@gmail.com'
    },
    show: {
        movie: {
            title: 'Test Movie: QR Code Test'
        },
        showDateTime: new Date(),
        theater: 'Savoy Premiere'
    },
    amount: 1500,
    bookedSeats: ['A1', 'A2']
};

async function test() {
    console.log('--- Testing Email with QR Code ---');
    console.log('Sending to:', mockBooking.user.email);
    console.log('Using SMTP user:', process.env.EMAIL_USER);
    
    try {
        await sendBookingConfirmation(mockBooking);
        console.log('✅ Test script completed attempt.');
    } catch (e) {
        console.error('❌ Test script failed:', e.message);
    }
}

test();
