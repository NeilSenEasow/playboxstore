// Import necessary modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User')

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs').promises;
const { auth } = require('express-openid-connect');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/playboxstore';
console.log('Starting server...');

// After middleware setup
console.log('Middleware setup complete');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// API route to read products data from JSON file
app.get('/api', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'products.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    res.json(data);
  } catch (error) {
    console.error('Error reading products data:', error);
    res.status(500).json({ message: 'Error loading products data' });
  }
});

app.post('/signup', (req, res) => {
  User.create(req.body)
  .then(User => res.json(User))
  .catch(err => res.json(err))
});

// Import and use routes from the routes folder
const routes = require('./routes/index');
app.use('/api', routes); // Prefix all routes with /api

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});