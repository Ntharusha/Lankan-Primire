const axios = require('axios');

const testBooking = async () => {
    try {
        const baseURL = 'http://localhost:5000/api';

        // 1. Login to get token
        console.log('Logging in...');
        const loginRes = await axios.post(`${baseURL}/users/login`, {
            email: 'admin@lankanpremiere.com',
            password: 'adminpassword123'
        });
        const token = loginRes.data.token;
        console.log('Login successful');

        const authHeader = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2. Get Shows to get IDs
        const showRes = await axios.get(`${baseURL}/shows`);
        const show = showRes.data[0];

        if (!show) {
            console.error('No shows found');
            return;
        }

        console.log('Found Show:', show._id);

        // 3. Create Booking Payload
        const payload = {
            user: {
                name: 'Debug User',
                email: 'debug@example.com'
            },
            show: {
                movie: show.movie._id,
                showDateTime: show.dateTime,
                showPrice: 1500,
                theater: show.theater.name,
                showId: show._id
            },
            bookedSeats: ['A7', 'A8'],
            amount: 3000,
            isPaid: false
        };

        console.log('Sending Payload:', payload);

        const res = await axios.post(`${baseURL}/bookings`, payload, authHeader);
        console.log('Booking Response:', res.status, res.data);

    } catch (error) {
        console.error('Booking Failed:', error.response ? error.response.data : error.message);
    }
};

testBooking();
