const mongoose = require('mongoose');

const uri = 'mongodb+srv://ghost69:Tharushaabc@cluster0.qofq3gf.mongodb.net/lankan-primire?retryWrites=true&w=majority';

async function checkConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB Atlas!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

checkConnection();
