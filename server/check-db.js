const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Atlas Connected ✅");

        const movies = await Movie.find({}, 'title poster_path');

        console.log(JSON.stringify(movies, null, 2));

    } catch (error) {
        console.error("MongoDB Error ❌:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

checkData();