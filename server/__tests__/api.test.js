const request = require('supertest');
const express = require('express');

// Mock a simple express app behavior since we are setting up infra 
const app = express();
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('Server Infrastructure', () => {
    it('should test supertest network booting properly', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });
});
