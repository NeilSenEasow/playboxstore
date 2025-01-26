const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');
const User = require('./models/User'); // Import the User model

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['SECRET', 'MONGODB_URI', 'BASEURL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Express app
const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes

// Add this route before the existing routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    endpoints: {
      products: '/api/products',
      register: '/auth/register',
      login: '/auth/login',
      test: '/test'
    }
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// Register route
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1h' });

    // Respond with user and token
    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login route
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1h' });

    // Respond with user and token
    res.status(200).json({ user, token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: err.message });
  }
});

// Products route
app.get('/api/products', async (req, res) => {
  try {
    // Path to the products.json file
    const filePath = path.join(__dirname, 'data', 'products.json');

    // Read the file
    const jsonData = await fs.readFile(filePath, 'utf8');

    // Parse the JSON data
    const products = JSON.parse(jsonData);

    // Respond with the products data
    res.json(products);
  } catch (err) {
    console.error('Error reading products data:', err);
    res.status(500).json({ error: 'Error loading products data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});