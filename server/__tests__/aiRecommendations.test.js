const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const movieRoutes = require('../routes/movies');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/movies', movieRoutes);

describe('AI Recommendation Engine: The Directors Cut', () => {
    let token = '';
    let userId = '';

    beforeAll(async () => {
        // Create User
        const user = new User({ name: 'Curator User', email: 'curator@domain.com', password: 'pwd' });
        await user.save();
        userId = user._id;
        token = jwt.sign({ user: { id: user._id, email: user.email } }, process.env.JWT_SECRET || 'secret');

        // Create Movies
        const romanticMovie = new Movie({ 
            title: 'Romeo & Juliet', genres: [{ name: 'Romance' }], moodTags: ['Romantic'],
            release_date: '2020', overview: 'desc', backdrop_path: '/b.jpg', poster_path: '/p.jpg',
            titleSinhala: 'RJ-S', titleTamil: 'RJ-T', isShowing: true
        });
        await romanticMovie.save();

        const actionMovie = new Movie({ 
            title: 'John Wick', genres: [{ name: 'Action' }], moodTags: ['Action'],
            release_date: '2020', overview: 'desc', backdrop_path: '/b2.jpg', poster_path: '/p2.jpg',
            titleSinhala: 'JW-S', titleTamil: 'JW-T', isShowing: true
        });
        await actionMovie.save();

        // Create a past booking for Romance
        const booking = new Booking({
            user: { name: 'Curator User', email: 'curator@domain.com' },
            show: { 
                movie: romanticMovie._id, 
                showDateTime: new Date().toISOString(),
                theater: 'Screen X',
                showPrice: 500
            },
            bookedSeats: ['A1'],
            amount: 500,
            isPaid: true
        });
        await booking.save();
    });

    it('should NOT recommend the movie the user has already watched', async () => {
        const res = await request(app)
            .get('/api/movies/recommendations')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        const titles = res.body.map(m => m.title);
        expect(titles).not.toContain('Romeo & Juliet');
    });

    it('should prioritize Action if it matches a broad category but fallback if no genre history match for unbooked movies', async () => {
        // In the setup above, the user watched Romance. 
        // John Wick is Action. 
        // Romeo & Juliet is Romance (Watched).
        const res = await request(app)
            .get('/api/movies/recommendations')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].title).toBe('John Wick');
    });
});
