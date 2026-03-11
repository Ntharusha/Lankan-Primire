const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

const movies = [
    {
        title: "Miniganduwa",
        titleSinhala: "මිනිගාඬුව",
        titleTamil: "மினிகண்டுவா",
        overview: "A gripping thriller set in the heart of Sri Lanka, exploring themes of mystery and justice in a small coastal village.",
        poster_path: "https://img.youtube.com/vi/kPummbLKlts/hqdefault.jpg",
        backdrop_path: "https://img.youtube.com/vi/kPummbLKlts/maxresdefault.jpg",
        release_date: "2024-05-15",
        runtime: 135,
        vote_average: 8.2,
        isShowing: true,
        moodTags: ["Thrilled", "Action"],
        genres: [{ id: 1, name: "Thriller" }, { id: 2, name: "Drama" }]
    },
    {
        title: "Kandak Sema",
        titleSinhala: "කන්දක් සේමා",
        titleTamil: "கந்தக் சேமா",
        overview: "Based on the acclaimed novel, this emotional journey follows a woman's struggle and resilience across different cultures and landscapes.",
        poster_path: "https://img.youtube.com/vi/ztTmdYoNsxA/hqdefault.jpg",
        backdrop_path: "https://img.youtube.com/vi/ztTmdYoNsxA/maxresdefault.jpg",
        release_date: "2024-03-10",
        runtime: 142,
        vote_average: 7.9,
        isShowing: true,
        moodTags: ["Romantic", "Family-time"],
        genres: [{ id: 3, name: "Romance" }, { id: 2, name: "Drama" }]
    },
    {
        title: "Visangamanaya",
        titleSinhala: "විසංගමනය",
        titleTamil: "விசங்கமனய",
        overview: "A deep dive into human psychology and the complexities of modern relationships, set against the backdrop of Colombo.",
        poster_path: "https://img.youtube.com/vi/wZq_svKB0KQ/hqdefault.jpg",
        backdrop_path: "https://img.youtube.com/vi/wZq_svKB0KQ/maxresdefault.jpg",
        release_date: "2024-01-20",
        runtime: 128,
        vote_average: 7.5,
        isShowing: true,
        moodTags: ["Romantic"],
        genres: [{ id: 2, name: "Drama" }]
    },
    {
        title: "Gindari 3",
        titleSinhala: "ගින්දරී 3",
        titleTamil: "கின்தரி 3",
        overview: "The third installment of the hilarious supernatural comedy franchise. Bahubuthayo are back for more chaos!",
        poster_path: "https://img.youtube.com/vi/O3d5JQzWnq4/hqdefault.jpg",
        backdrop_path: "https://img.youtube.com/vi/O3d5JQzWnq4/maxresdefault.jpg",
        release_date: "2024-06-01",
        runtime: 115,
        vote_average: 8.5,
        isShowing: true,
        moodTags: ["Comedy", "Family-time"],
        genres: [{ id: 4, name: "Comedy" }, { id: 5, name: "Fantasy" }]
    }
];

async function seedNewMovies() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lankan-premiere');
        console.log('Connected to MongoDB...');

        for (const movieData of movies) {
            const existing = await Movie.findOne({ title: movieData.title });
            if (existing) {
                console.log(`Movie "${movieData.title}" already exists. Updating...`);
                await Movie.updateOne({ _id: existing._id }, movieData);
            } else {
                const movie = new Movie(movieData);
                await movie.save();
                console.log(`Added: ${movieData.title}`);
            }
        }

        console.log('✅ Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding movies:', err);
        process.exit(1);
    }
}

seedNewMovies();
