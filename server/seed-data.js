const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Show = require('./models/Show');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lankan-premiere');

        // 1. Create Theater
        let theater = await Theater.findOne({ name: 'Liberty by Scope' });
        if (!theater) {
            theater = await Theater.create({
                name: 'Liberty by Scope',
                location: 'Colpetty',
                city: 'Colombo',
                amenities: ['Dolby Atmos', '4K Projection', 'Canteen']
            });
            console.log('Theater created: Liberty by Scope');
        } else {
            console.log('Theater already exists');
        }

        // 2. Create Movie
        let movie = await Movie.findOne({ title: 'Interstellar' });
        if (!movie) {
            movie = await Movie.create({
                title: 'Interstellar',
                titleSinhala: '',
                titleTamil: 'Interstellar',
                overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
                backdrop_path: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
                release_date: '2014-11-07',
                vote_average: 8.6,
                vote_count: 30000,
                runtime: 169,
                genres: [{ id: 18, name: 'Drama' }, { id: 878, name: 'Science Fiction' }],
                casts: [{ name: 'Matthew McConaughey', profile_path: '' }],
                moodTags: ['Thrilled', 'Action'],
                isShowing: true
            });
            console.log('Movie created: Interstellar');
        } else {
            console.log('Movie already exists');
        }

        // 3. Create Show
        // Create seat grid
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const cols = 12;
        const seatGrid = rows.map(row =>
            Array.from({ length: cols }, (_, i) => ({
                seatNumber: `${row}${i + 1}`,
                category: row === 'A' ? 'Balcony' : row === 'H' ? 'Box' : 'ODC',
                isAvailable: true,
                isLocked: false
            }))
        );

        const showTime = new Date();
        showTime.setHours(19, 0, 0, 0); // 7:00 PM today

        let show = await Show.findOne({ movie: movie._id, theater: theater._id });
        if (!show) {
            await Show.create({
                movie: movie._id,
                theater: theater._id,
                dateTime: showTime,
                basePrice: 1500,
                seatGrid: seatGrid
            });
            console.log('Show created for Interstellar at Liberty');
        } else {
            console.log('Show already exists');
        }

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
