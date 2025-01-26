const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs').promises;
const User = require('./models/User'); // Ensure you have the User model defined
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded data

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API route to read products data from JSON file
app.get('/api', async (req, res) => { // Product data route
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

// Sign Up Route
app.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Sign In Route
app.post('/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log('Sign-in attempt:', { email, password }); // Log the received credentials

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Server error during sign-in' });
  }
});

// Import and use routes from the routes folder
const routes = require('./routes/index');
app.use('/api', routes); // Prefix all routes with /api

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));