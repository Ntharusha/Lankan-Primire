const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Show = require('./models/Show');
const Booking = require('./models/Booking');
require('dotenv').config();

const englishMovies = [
    {
        title: "Dune: Part Two",
        titleSinhala: "ඩූන්: දෙවන කොටස",
        titleTamil: "டூன்: பகுதி 2",
        overview: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        backdrop_path: "/ylkdrn23p3gQcHx7ukIfuy2CkTE.jpg",
        release_date: "2024-03-01",
        runtime: 166,
        vote_average: 8.8,
        isShowing: true,
        original_language: 'en',
        moodTags: ["Action", "Thrilled"],
        genres: [{ id: 878, name: "Sci-Fi" }, { id: 12, name: "Adventure" }]
    },
    {
        title: "Deadpool & Wolverine",
        titleSinhala: "ඩෙඩ්පූල් සහ වුල්වරින්",
        titleTamil: "டெட்பூல் & வோல்வரின்",
        overview: "A listless Wade Wilson toils in civilian life while his days as the morally flexible mercenary, Deadpool, are behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
        poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        backdrop_path: "/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
        release_date: "2024-07-26",
        runtime: 127,
        vote_average: 7.8,
        isShowing: true,
        original_language: 'en',
        moodTags: ["Comedy", "Action"],
        genres: [{ id: 28, name: "Action" }, { id: 35, name: "Comedy" }]
    },
    {
        title: "Oppenheimer",
        titleSinhala: "ඔපන්හයිමර්",
        titleTamil: "ஓப்பன்ஹைமர்",
        overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        backdrop_path: "/ycnO0cjsAROSGJKuMODgRtWsHQw.jpg",
        release_date: "2023-07-21",
        runtime: 180,
        vote_average: 8.1,
        isShowing: true,
        original_language: 'en',
        moodTags: ["Thrilled"],
        genres: [{ id: 18, name: "Drama" }, { id: 36, name: "History" }]
    },
    {
        title: "Spider-Man: Across the Spider-Verse",
        titleSinhala: "ස්පයිඩර් මෑන්: ඇක්‍රොස් ද ස්පයිඩර් වර්ස්",
        titleTamil: "ஸ்பைடர் மேன்: அக்ரோஸ் தி ஸ்பைடர் வெர்ஸ்",
        overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        backdrop_path: "/9xfDWXAUbFXQK585JvByT5pEAhe.jpg",
        release_date: "2023-06-02",
        runtime: 140,
        vote_average: 8.4,
        isShowing: true,
        original_language: 'en',
        moodTags: ["Action", "Thrilled"],
        genres: [{ id: 16, name: "Animation" }, { id: 28, name: "Action" }]
    }
];

const theatersData = [
    {
        name: 'Liberty by Scope',
        location: 'Colpetty',
        city: 'Colombo',
        amenities: ['Dolby Atmos', '4K Projection', 'Canteen']
    },
    {
        name: 'Savoy Premiere',
        location: 'Wellawatte',
        city: 'Colombo',
        amenities: ['Dolby 7.1', 'Luxury Seats', 'Popcorn Corner']
    }
];

const generateSeatGrid = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = 12;
    return rows.map(row =>
        Array.from({ length: cols }, (_, i) => ({
            seatNumber: `${row}${i + 1}`,
            category: row === 'A' ? 'Balcony' : row === 'H' ? 'Box' : 'ODC',
            isAvailable: true,
            isLocked: false
        }))
    );
};

async function seedEnglishMovies() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lankan-premiere');
        console.log('Connected to MongoDB...');

        // Clear existing data
        console.log('Removing existing movies, theaters, shows and bookings...');
        await Movie.deleteMany({});
        await Theater.deleteMany({});
        await Show.deleteMany({});
        await Booking.deleteMany({});

        // Create Theaters
        const theaters = [];
        for (const tData of theatersData) {
            const theater = new Theater(tData);
            await theater.save();
            theaters.push(theater);
            console.log(`Added Theater: ${tData.name}`);
        }

        // Create Movies
        const movies = [];
        for (const movieData of englishMovies) {
            const movie = new Movie(movieData);
            await movie.save();
            movies.push(movie);
            console.log(`Added Movie: ${movieData.title}`);
        }

        // Create Shows for each movie in each theater
        const times = [10, 13, 16, 19]; // 10 AM, 1 PM, 4 PM, 7 PM
        for (const movie of movies) {
            for (const theater of theaters) {
                for (const hour of times) {
                    const showTime = new Date();
                    showTime.setHours(hour, 0, 0, 0);
                    
                    await Show.create({
                        movie: movie._id,
                        theater: theater._id,
                        dateTime: showTime,
                        basePrice: 1500,
                        seatGrid: generateSeatGrid()
                    });
                }
            }
            console.log(`Created shows for: ${movie.title}`);
        }

        console.log('✅ English movies and shows seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}

seedEnglishMovies();
