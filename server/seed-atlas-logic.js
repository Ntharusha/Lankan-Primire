const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Show = require('./models/Show');

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
    moodTags: ['Romantic'],
    isShowing: true
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
    moodTags: ['Thrilled', 'Action'],
    isShowing: true
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
    genres: [{ id: 18, name: 'Drama' }, { id: 878, name: 'Science Fiction' }],
    moodTags: ['Thrilled', 'Action'],
    isShowing: true
  }
];

const theaterData = {
  name: 'Liberty by Scope',
  location: 'Colpetty',
  city: 'Colombo',
  amenities: ['Dolby Atmos', '4K Projection', 'Canteen', 'Parking']
};

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

const seedAtlas = async () => {
  try {
    // Theater
    let theater = await Theater.findOne({ name: theaterData.name });
    if (!theater) {
      theater = await Theater.create(theaterData);
    }

    // Movies
    for (const movieData of movies) {
      let movie = await Movie.findOne({ title: movieData.title });
      if (!movie) {
        movie = await Movie.create(movieData);
      }

      // Shows
      if (movieData.isShowing) {
        const showTime = new Date();
        showTime.setHours(19, 0, 0, 0); 

        const existingShow = await Show.findOne({ movie: movie._id, theater: theater._id });
        if (!existingShow) {
          await Show.create({
            movie: movie._id,
            theater: theater._id,
            dateTime: showTime,
            basePrice: 1500,
            seatGrid: createSeatGrid()
          });
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Seeding error:', error.message);
    throw error;
  }
};

module.exports = seedAtlas;
