const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Show = require('./models/Show');
require('dotenv').config();

const sinhalaMovies = [
    {
        title: "Gindari 3",
        titleSinhala: "ගින්දරී 3",
        titleTamil: "கின்தரி 3",
        overview: "The third installment of the blockbuster Gindari comedy series. Following the hilarious adventures of the bahirawa maiden who returns to the human world, causing absolute chaos and laughter in Colombo's streets. A colorful riot of action and comedy for the whole family.",
        poster_path: "/assets/movies/gindari_3_poster.png",
        backdrop_path: "/assets/movies/gindari_3_backdrop.png",
        release_date: "2024-05-30",
        runtime: 142,
        vote_average: 8.4,
        isShowing: true,
        original_language: 'si',
        moodTags: ["Comedy", "Action"],
        genres: [{ id: 35, name: "Comedy" }, { id: 28, name: "Action" }]
    },
    {
        title: "Sihinaya Abiyasa",
        titleSinhala: "සිහිනය අභියස",
        titleTamil: "கனவு அருகில்",
        overview: "A poignant romantic drama that follows two lovers as they navigate social barriers and personal dreams in the picturesque hill country of Sri Lanka. A story of sacrifice, hope, and the enduring power of true love.",
        poster_path: "/assets/movies/sihinaya_abiyasa_poster.png",
        backdrop_path: "/assets/movies/sihinaya_abiyasa_backdrop.png",
        release_date: "2024-06-15",
        runtime: 138,
        vote_average: 8.6,
        isShowing: true,
        original_language: 'si',
        moodTags: ["Romantic", "Family-time"],
        genres: [{ id: 18, name: "Drama" }, { id: 10749, name: "Romance" }]
    },
    {
        title: "Mineegandaba",
        titleSinhala: "මිනීගාන්ධබ",
        titleTamil: "மினீகந்தபா",
        overview: "An intense, high-stakes urban thriller that delves into the dark underbelly of systemic corruption and personal vendettas. A gritty portrayal of survival and justice in a modern city where nothing is as it seems.",
        poster_path: "/assets/movies/mineegandaba_poster.png",
        backdrop_path: "/assets/movies/mineegandaba_backdrop.png",
        release_date: "2024-08-10",
        runtime: 155,
        vote_average: 8.1,
        isShowing: true,
        original_language: 'si',
        moodTags: ["Thrilled", "Action"],
        genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }]
    },
    {
        title: "Father",
        titleSinhala: "ෆාදර්",
        titleTamil: "பாதர்",
        overview: "A gritty gangster film based on true events in Sri Lanka between 1976 and 1991. The story revolves around the notorious Gampaha Osmond and Desmond Gunasekara, a religious young man whose life is transformed by violence.",
        poster_path: "/assets/movies/father_poster.png",
        backdrop_path: "/assets/movies/father_poster.png",
        release_date: "2026-01-09",
        runtime: 145,
        vote_average: 8.8,
        isShowing: true,
        original_language: 'si',
        moodTags: ["Thrilled", "Action"],
        genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }, { id: 80, name: "Crime" }]
    },
    {
        title: "OIC Gadafi",
        titleSinhala: "OIC ගඩාෆි",
        titleTamil: "OIC கடாபி",
        overview: "A high-octane action comedy directed by the legendary Ranjan Ramanayake. A charismatic police officer navigates through thrills, intrigue, and explosive fights in this star-studded cinematic journey.",
        poster_path: "/assets/movies/oic_gadafi_poster.png",
        backdrop_path: "/assets/movies/oic_gadafi_poster.png",
        release_date: "2026-02-15",
        runtime: 150,
        vote_average: 8.5,
        isShowing: true,
        original_language: 'si',
        moodTags: ["Comedy", "Action"],
        genres: [{ id: 28, name: "Action" }, { id: 35, name: "Comedy" }]
    },
    {
        title: "Neera",
        titleSinhala: "නීරා",
        titleTamil: "நீரா",
        overview: "A heartfelt romantic drama exploring the unseen threads that bind people across time. Mega and his pen pal Neera share a bond of love, rediscovery, and passion in this soul-stirring tale.",
        poster_path: "/assets/movies/neera_poster.png",
        backdrop_path: "/assets/movies/neera_poster.png",
        release_date: "2025-09-18",
        runtime: 132,
        vote_average: 8.9,
        isShowing: true,
        original_language: 'si',
        moodTags: ["Romantic", "Family-time"],
        genres: [{ id: 10749, name: "Romance" }, { id: 18, name: "Drama" }]
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

async function seedSinhalaMovies() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lankan-premiere');
        console.log('Connected to MongoDB...');

        // Clear existing data
        console.log('Removing existing movies, theaters, and shows...');
        await Movie.deleteMany({});
        await Theater.deleteMany({});
        await Show.deleteMany({});

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
        for (const movieData of sinhalaMovies) {
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
                    // Add some days if needed, currently just today
                    
                    await Show.create({
                        movie: movie._id,
                        theater: theater._id,
                        dateTime: showTime,
                        basePrice: movie.title === "Gindari 3" ? 1200 : 1500,
                        seatGrid: generateSeatGrid()
                    });
                }
            }
            console.log(`Created shows for: ${movie.title}`);
        }

        console.log('✅ Sinhala movies and shows seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}

seedSinhalaMovies();
