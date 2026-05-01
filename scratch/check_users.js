const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '..', 'server', '.env');
require('dotenv').config({ path: envPath });

const User = require('../server/models/User');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find();
        const emails = users.map(u => u.email);
        const lowerEmails = emails.map(e => e.toLowerCase());
        
        const duplicates = lowerEmails.filter((item, index) => lowerEmails.indexOf(item) !== index);
        
        if (duplicates.length > 0) {
            console.log('Found potential case-insensitive duplicates:', [...new Set(duplicates)]);
        } else {
            console.log('No case-insensitive duplicates found.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
