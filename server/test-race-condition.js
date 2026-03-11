const axios = require('axios');

const testRaceCondition = async () => {
    try {
        const baseURL = 'http://localhost:5000/api';

        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${baseURL}/users/login`, {
            email: 'admin@lankanpremiere.com',
            password: 'adminpassword123'
        });
        const token = loginRes.data.token;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Get a show and an available seat
        const showRes = await axios.get(`${baseURL}/shows`);
        const show = showRes.data[0];
        if (!show) {
            console.error('No shows found');
            return;
        }

        const seat = show.seatGrid.flat().find(s => s.isAvailable && !s.isLocked);
        if (!seat) {
            console.error('No available seats found for testing');
            return;
        }

        console.log(`Testing race condition on Seat: ${seat.seatNumber} for Show: ${show._id}`);

        // 3. Simulate multiple users locking the SAME seat at the SAME time
        // We use different "userIds" in the mock data if the system supports it, 
        // but here we just want to see if the DB atomicity holds.
        const lockRequest = (userId) => axios.post(`${baseURL}/shows/lock`, {
            showId: show._id,
            seatNumber: seat.seatNumber,
            userId: userId
        }, authHeader); // Note: I need to check if /api/shows/lock exists or if it's socket only.

        // Wait, looking at index.js, lock_seat is via Socket.io. 
        // I should stick to testing the service logic or implement a REST endpoint if needed.
        // Actually, let's look at showService.js refactor - it's exported.
        // I'll create a temporary test script that imports the service if I can run it locally,
        // or just test via the routes I DO have.

        console.log('Note: Seat locking is via Socket.io in this app. This script will attempt to use a (hypothetical) REST endpoint or I will verify via Socket.io client.');

        // Let's check index.js again.
        // socket.on('lock_seat', async (data) => { await lockSeat(...) })

        // I'll use a socket.io-client to test.
    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

testRaceCondition();
