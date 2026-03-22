const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

async function checkData() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lankan-premiere');
    const movies = await Movie.find({}, 'title poster_path');
    console.log(JSON.stringify(movies, null, 2));
    process.exit(0);
}

checkData();
