const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const bookingRoutes = require('../routes/bookings');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Mock IO and Auth middleware simulation
app.use((req, res, next) => {
    req.io = {
        to: jest.fn().mockReturnValue({
            emit: jest.fn()
        })
    };
    next();
});

app.use('/api/bookings', bookingRoutes);

describe('Booking Routes', () => {
    let token = '';
    let mockUserId = '';
    let mockShowId = '';
    
    beforeAll(async () => {
        // Create Mock User
        const user = new User({ name: 'Booker', email: 'booker@test.com', password: 'pwd', role: 'user' });
        await user.save();
        mockUserId = user._id;

        // Generate Token to simulate Auth middleware success
        token = jwt.sign({ user: { id: user._id, role: 'user' } }, process.env.JWT_SECRET || 'secret');

        // Create Mock Movie and Show
        const movie = new Movie({ 
            title: 'Test Movie', 
            release_date: '2025-01-01', 
            overview: 'desc',
            backdrop_path: '/dummy.jpg',
            poster_path: '/dummy.jpg',
            titleTamil: 'Test Tamil',
            titleSinhala: 'Test Sinhala'
        });
        await movie.save();

        const show = new Show({
            movie: movie._id,
            theater: new mongoose.Types.ObjectId(),
            dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            basePrice: 500,
            seatGrid: [[
                { seatNumber: 'A1', isAvailable: true, isLocked: false, category: 'ODC' },
                { seatNumber: 'A2', isAvailable: true, isLocked: false, category: 'ODC' }
            ]]
        });
        await show.save();
        mockShowId = show._id;
    });

    // NOTE: Auth middleware inside bookingRoutes uses JWT token correctly from headers.
    it('should create a new booking for authenticated user', async () => {
        const payload = {
            show: {
                showId: mockShowId,
                movie: { title: 'Test Movie' },
                showDateTime: new Date().toISOString(),
                theater: 'Test Theater',
                showPrice: 500
            },
            bookedSeats: ['A1'],
            amount: 500,
            isPaid: true,
            user: { name: 'Booker', email: 'booker@test.com' }
        };

        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${token}`)
            .send(payload);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.bookedSeats).toContain('A1');
    });

    it('should reject unauthenticated booking fetch', async () => {
        const res = await request(app)
            .get('/api/bookings/my');
            
        expect(res.statusCode).toEqual(401);
    });
});
