const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleSinhala: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
    required: true,
  },
  backdrop_path: {
    type: String,
    required: true,
  },
  genres: [{
    id: Number,
    name: String,
  }],
  release_date: {
    type: String,
    required: true,
  },
  original_language: {
    type: String,
    default: 'si',
  },
  tagline: {
    type: String,
  },
  vote_average: {
    type: Number,
    default: 0,
  },
  vote_count: {
    type: Number,
    default: 0,
  },
  runtime: {
    type: Number,
    default: 0,
  },
  casts: [{
    name: String,
    profile_path: String,
  }],
  isShowing: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Movie', movieSchema);

