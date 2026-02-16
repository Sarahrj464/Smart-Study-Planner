const mongoose = require('mongoose');

async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected ✅');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    throw err;
  }
}

module.exports = { connectDB, mongoose };