const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Try to find .env in various locations
const envPaths = [
    path.join(__dirname, '..', 'server', '.env'),
    path.join(__dirname, '..', '.env'),
    path.join(process.cwd(), 'server', '.env'),
    path.join(process.cwd(), '.env')
];

let envPath = null;
for (const p of envPaths) {
    if (fs.existsSync(p)) {
        envPath = p;
        break;
    }
}

if (envPath) {
    console.log('Loading env from:', envPath);
    require('dotenv').config({ path: envPath });
} else {
    console.warn('No .env file found!');
}

const Booking = require('../server/models/Booking');

async function checkBookings() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not defined');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const bookings = await Booking.find().limit(20);
        console.log('Recent Bookings:');
        if (bookings.length === 0) {
            console.log('No bookings found in DB.');
        }
        bookings.forEach(b => {
            console.log(`- ID: ${b._id}, Email: ${b.user?.email}, Amount: ${b.amount}, Paid: ${b.isPaid}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkBookings();
