const mongoose = require('mongoose');
require('dotenv').config();

// Provide your MongoDB Atlas connection string
// Make sure to connect to the DB named 2025b_final_sid

MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017/asdfasdfasdf';

mongoose.connect(MONGODB_CONNECTION_STRING)
        .then(() => {console.log("Connected to MongoDB Atlas")})
        .catch(error => {console.error(error)});

module.exports = mongoose;