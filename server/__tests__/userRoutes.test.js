const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const userRoutes = require('../routes/users');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
    let token = '';
    let userId = '';

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Test Setup User',
                email: 'testsetup@domain.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.email).toBe('testsetup@domain.com');

        token = res.body.token;
        userId = res.body.user.id;
    });

    it('should not register user with existing email', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Duplicate',
                email: 'testsetup@domain.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('User already exists');
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'testsetup@domain.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should get user profile with token', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toBe('testsetup@domain.com');
    });

    it('should deny profile access without token', async () => {
        const res = await request(app).get('/api/users/me');
        expect(res.statusCode).toEqual(401);
    });
});
