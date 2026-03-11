const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

const englishMovies = [
    {
        title: "Dune: Part Two",
        titleSinhala: "ඩූන්: දෙවන කොටස",
        titleTamil: "டூன்: பகுதி 2",
        overview: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        poster_path: "/6619p60mPT97s6f1r279fT3.jpg",
        backdrop_path: "/xOMo8NETsO2HnaUe3vFc2HGvIbh.jpg",
        release_date: "2024-03-01",
        runtime: 166,
        vote_average: 8.8,
        isShowing: true,
        moodTags: ["Action", "Thrilled"],
        genres: [{ id: 878, name: "Sci-Fi" }, { id: 12, name: "Adventure" }]
    },
    {
        title: "Deadpool & Wolverine",
        titleSinhala: "ඩෙඩ්පූල් සහ වුල්වරින්",
        titleTamil: "டெட்பூல் & வோல்வரின்",
        overview: "A listless Wade Wilson toils in civilian life while his days as the morally flexible mercenary, Deadpool, are behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
        poster_path: "/8cdcl36UuB9G8BMfgTSjndbb7H6.jpg",
        backdrop_path: "/yDHYT7VpArv6uH1zPreY3BqAWqv.jpg",
        release_date: "2024-07-26",
        runtime: 127,
        vote_average: 7.8,
        isShowing: true,
        moodTags: ["Comedy", "Action"],
        genres: [{ id: 28, name: "Action" }, { id: 35, name: "Comedy" }]
    },
    {
        title: "Oppenheimer",
        titleSinhala: "ඔපන්හයිමර්",
        titleTamil: "ஓப்பன்ஹைமர்",
        overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        poster_path: "/8Gxv0mYmUpe9XUkvCc0Z3ioeUYX.jpg",
        backdrop_path: "/fm6Ns0Ycy02BIBy6Bds7qp0YvZq.jpg",
        release_date: "2023-07-21",
        runtime: 180,
        vote_average: 8.1,
        isShowing: true,
        moodTags: ["Thrilled"],
        genres: [{ id: 18, name: "Drama" }, { id: 36, name: "History" }]
    },
    {
        title: "Spider-Man: Across the Spider-Verse",
        titleSinhala: "ස්පයිඩර් මෑන්: ඇක්‍රොස් ද ස්පයිඩර් වර්ස්",
        titleTamil: "ஸ்பைடர் மேன்: அக்ரோஸ் தி ஸ்பைடர் வெர்ஸ்",
        overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        poster_path: "/8Vtpi9p9vC4uBs6IRllR9tU9SML.jpg",
        backdrop_path: "/4HodYYKEIsS6dn6gUczv08gaI6m.jpg",
        release_date: "2023-06-02",
        runtime: 140,
        vote_average: 8.4,
        isShowing: true,
        moodTags: ["Action", "Thrilled"],
        genres: [{ id: 16, name: "Animation" }, { id: 28, name: "Action" }]
    }
];

async function seedEnglishMovies() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lankan-premiere');
        console.log('Connected to MongoDB...');

        for (const movieData of englishMovies) {
            const existing = await Movie.findOne({ title: movieData.title });
            if (existing) {
                await Movie.findByIdAndUpdate(existing._id, movieData);
                console.log(`Updated: ${movieData.title}`);
            } else {
                const movie = new Movie(movieData);
                await movie.save();
                console.log(`Added: ${movieData.title}`);
            }
        }

        console.log('✅ English movies added complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding movies:', err);
        process.exit(1);
    }
}

seedEnglishMovies();
