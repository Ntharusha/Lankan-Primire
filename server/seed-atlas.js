const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Show = require('./models/Show');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ─── Example Movies ──────────────────────────────────────────────────────────
const movies = [
  {
    title: 'Adarei Man Adarei',
    titleSinhala: 'ආදරෙයි මං ආදරෙයි',
    titleTamil: 'Adarei Man Adarei',
    overview: 'A romantic Sinhala film about two young lovers navigating the challenges of family and modern life in Colombo.',
    poster_path: '/sinhala-romance.jpg',
    backdrop_path: '/sinhala-romance-backdrop.jpg',
    release_date: '2024-02-14',
    original_language: 'si',
    runtime: 112,
    vote_average: 7.8,
    vote_count: 1200,
    genres: [{ id: 10749, name: 'Romance' }, { id: 18, name: 'Drama' }],
    casts: [{ name: 'Udari Warnakulasooriya', profile_path: '' }, { name: 'Menaka Rajapaksha', profile_path: '' }],
    moodTags: ['Romantic'],
    isShowing: true,
    trailerUrl: null,
    tagline: 'Love is worth fighting for'
  },
  {
    title: 'Kasthuri Man Jayantha',
    titleSinhala: 'කස්තූරි මං ජයන්ත',
    titleTamil: 'Kasthuri Man Jayantha',
    overview: 'A thrilling action drama based on true events following a young detective uncovering a major corruption scandal in Sri Lanka.',
    poster_path: '/sinhala-action.jpg',
    backdrop_path: '/sinhala-action-backdrop.jpg',
    release_date: '2024-03-01',
    original_language: 'si',
    runtime: 135,
    vote_average: 8.1,
    vote_count: 2300,
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }],
    casts: [{ name: 'Jackson Anthony', profile_path: '' }, { name: 'Damitha Abeyratne', profile_path: '' }],
    moodTags: ['Thrilled', 'Action'],
    isShowing: true,
    trailerUrl: null,
    tagline: 'Justice has no fear'
  },
  {
    title: 'Interstellar',
    titleSinhala: 'Interstellar',
    titleTamil: 'Interstellar',
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    release_date: '2014-11-07',
    original_language: 'en',
    runtime: 169,
    vote_average: 8.6,
    vote_count: 30000,
    genres: [{ id: 18, name: 'Drama' }, { id: 878, name: 'Science Fiction' }],
    casts: [{ name: 'Matthew McConaughey', profile_path: '' }, { name: 'Anne Hathaway', profile_path: '' }],
    moodTags: ['Thrilled', 'Action'],
    isShowing: true,
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    tagline: 'Mankind was born on Earth. It was never meant to die here.'
  },
  {
    title: 'Avengers: Endgame',
    titleSinhala: 'Avengers: Endgame',
    titleTamil: 'Avengers: Endgame',
    overview: 'The Avengers assemble once more to reverse the actions of Thanos and restore balance to the universe.',
    poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdrop_path: '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    release_date: '2019-04-26',
    original_language: 'en',
    runtime: 181,
    vote_average: 8.4,
    vote_count: 24000,
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Science Fiction' }],
    casts: [{ name: 'Robert Downey Jr.', profile_path: '' }, { name: 'Chris Evans', profile_path: '' }],
    moodTags: ['Thrilled', 'Action'],
    isShowing: false,
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    tagline: 'Whatever it takes.'
  },
  {
    title: 'Sangili Muthu',
    titleSinhala: 'Sangili Muthu',
    titleTamil: 'சங்கிலி முத்து',
    overview: 'A Tamil action film about a fisherman who becomes a local hero fighting against injustice in the coastal villages of Northern Sri Lanka.',
    poster_path: '/tamil-action.jpg',
    backdrop_path: '/tamil-action-backdrop.jpg',
    release_date: '2024-01-12',
    original_language: 'ta',
    runtime: 147,
    vote_average: 7.5,
    vote_count: 890,
    genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
    casts: [{ name: 'Vikram', profile_path: '' }, { name: 'Kajal Aggarwal', profile_path: '' }],
    moodTags: ['Thrilled', 'Action'],
    isShowing: true,
    trailerUrl: null,
    tagline: 'Fight for the right'
  },
];

// ─── Example Theater ─────────────────────────────────────────────────────────
const theaterData = {
  name: 'Liberty by Scope',
  location: 'Colpetty',
  city: 'Colombo',
  amenities: ['Dolby Atmos', '4K Projection', 'Canteen', 'Online Booking', 'Parking']
};

// ─── Seat Grid Helper ─────────────────────────────────────────────────────────
const createSeatGrid = () => {
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

// ─── Main Seed Function ───────────────────────────────────────────────────────
const seedAtlas = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.error('❌ ERROR: MONGODB_URI is not set in your .env file!');
      console.error('  Add your MongoDB Atlas connection string to server/.env:');
      console.error('  MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/lankan-primire');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas!\n');

    // ── 1. Create Theater ──────────────────────────────────────────
    let theater = await Theater.findOne({ name: theaterData.name });
    if (!theater) {
      theater = await Theater.create(theaterData);
      console.log(`🏟️  Theater created: ${theater.name}`);
    } else {
      console.log(`🏟️  Theater already exists: ${theater.name}`);
    }

    // ── 2. Create Movies & Shows ───────────────────────────────────
    console.log('\n🎬 Seeding movies...\n');

    for (const movieData of movies) {
      let movie = await Movie.findOne({ title: movieData.title });

      if (!movie) {
        movie = await Movie.create(movieData);
        console.log(`  ✅ Created movie: ${movie.title}`);
      } else {
        console.log(`  ⏭️  Skipping (already exists): ${movie.title}`);
      }

      // Create a show for each movie that is currently showing
      if (movieData.isShowing) {
        const showTime = new Date();
        showTime.setHours(19, 0, 0, 0); // 7:00 PM today

        const existingShow = await Show.findOne({ movie: movie._id, theater: theater._id });
        if (!existingShow) {
          await Show.create({
            movie: movie._id,
            theater: theater._id,
            dateTime: showTime,
            basePrice: 1500,
            seatGrid: createSeatGrid()
          });
          console.log(`     🎟️  Show created for: ${movie.title} at 7:00 PM`);
        }
      }
    }

    console.log('\n✅ Database seeded successfully on MongoDB Atlas!');
    console.log(`   Seeded: ${movies.length} movies, 1 theater`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedAtlas();
