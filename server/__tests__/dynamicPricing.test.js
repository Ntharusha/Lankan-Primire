const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const showRoutes = require('../routes/shows');

const app = express();
app.use(express.json());
app.use('/api/shows', showRoutes);

describe('Dynamic Pricing Engine', () => {
    let surgeShowId;
    let discountShowId;

    beforeAll(async () => {
        // Create Mock Movie and Theater
        const movie = new Movie({ 
            title: 'Pricing Movie', release_date: '2025-01-01', overview: 'desc',
            backdrop_path: '/dummy.jpg', poster_path: '/dummy.jpg',
            titleTamil: 'Test', titleSinhala: 'Test'
        });
        await movie.save();

        // 1. Array with 10 seats, 9 occupied = 90% (Surge)
        const surgeGrid = [];
        for (let i = 0; i < 10; i++) {
            surgeGrid.push({ seatNumber: `A${i}`, isAvailable: i === 9, isLocked: false, category: 'ODC' });
        }
        
        const surgeShow = new Show({
            movie: movie._id,
            theater: new mongoose.Types.ObjectId(),
            dateTime: new Date(Date.now() + 86400000).toISOString(),
            basePrice: 1000,
            seatGrid: [surgeGrid]
        });
        await surgeShow.save();
        surgeShowId = surgeShow._id;

        // 2. Array with 10 seats, 1 occupied = 10% (within 24 hours => Discount)
        const discountGrid = [];
        for (let i = 0; i < 10; i++) {
            discountGrid.push({ seatNumber: `B${i}`, isAvailable: i !== 0, isLocked: false, category: 'ODC' });
        }
        
        const discountShow = new Show({
            movie: movie._id,
            theater: new mongoose.Types.ObjectId(),
            dateTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
            basePrice: 1000,
            seatGrid: [discountGrid]
        });
        await discountShow.save();
        discountShowId = discountShow._id;
    });

    it('applies an active 15% surge price when seats are > 80% full', async () => {
        const res = await request(app).get(`/api/shows/${surgeShowId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.pricingBadge).toBe('High Demand Surge');
        expect(res.body.currentPrice).toBe(1150); // 1000 * 1.15
    });

    it('applies an active 15% discount when seats are < 20% full inside 24hrs', async () => {
        const res = await request(app).get(`/api/shows/${discountShowId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.pricingBadge).toBe('Last Minute Discount');
        expect(res.body.currentPrice).toBe(850); // 1000 * 0.85
    });
});
