const axios = require('axios');

async function simulateBooking() {
    try {
        const res = await axios.get('http://localhost:5000/api/movies');
        const movie = res.data[0];

        if (!movie) {
            console.log('No movies found to book');
            return;
        }

        const bookingData = {
            user: { name: 'Automated Tester', email: 'tester@nebula.com' },
            show: {
                movie: movie._id,
                showDateTime: new Date().toISOString(),
                showPrice: 1500,
                theater: 'Lankan Premiere - Liberty by Scope',
            },
            amount: 1500,
            bookedSeats: ['Z9'],
            isPaid: true,
            status: 'confirmed'
        };

        console.log('Simulating booking...');
        const bookingRes = await axios.post('http://localhost:5000/api/bookings', bookingData);
        console.log('Booking successful:', bookingRes.data._id);
    } catch (err) {
        console.error('Simulation failed:', err.message);
    }
}

simulateBooking();
