const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs").promises; // Use fs.promises for async/await
const path = require("path");
const User = require("./models/User"); // Import the User model
const Product = require("./models/Product"); // Import the Product model
const Admin = require('./models/Admin'); // Import Admin model

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["SECRET", "MONGODB_URI", "APP_URL", "BASEURL"];
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
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API root route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
    endpoints: {
      products: `${process.env.APP_URL}/api/products`,
      items: `${process.env.APP_URL}/api/items`,
      register: `${process.env.APP_URL}/auth/register`,
      login: `${process.env.APP_URL}/auth/login`,
      test: `${process.env.APP_URL}/test`,
      baseItems: `${process.env.BASEURL}/api/items`,
      baseProducts: `${process.env.BASEURL}/api/products`,
    },
  });
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Test route works!" });
});

// Register route
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login route
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "1h" });

    res.status(200).json({ user, token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  const products = await Product.find(); // Fetch products from MongoDB
  res.json(products);
});

// Get all items
app.get("/api/items", async (req, res) => {
  const items = await Product.find(); // Fetch items from MongoDB
  res.json(items);
});

// Add a new item (product)
app.post("/api/items", async (req, res) => {
  try {
    const { name, category, count } = req.body;
    console.log("Received data:", req.body); // Log the received data

    // Validate input
    if (!name || !category || count === undefined) {
      return res.status(400).json({ error: "All fields (name, category, count) are required" });
    }
    if (typeof name !== 'string' || typeof category !== 'string') {
      return res.status(400).json({ error: "Name and category should be strings" });
    }
    if (typeof count !== 'number' || count < 0) {
      return res.status(400).json({ error: "Count should be a positive number" });
    }

    const newItem = new Product({ name, category, availableQuantity: count });
    const savedItem = await newItem.save();

    if (!savedItem) {
      return res.status(500).json({ error: "Failed to add item to the database" });
    }

    res.status(201).json({ message: "Item added successfully", item: savedItem });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Error adding item: " + err.message }); // Provide more specific error message
  }
});

// Update item
app.put("/api/items/:id", async (req, res) => {
  try {
    const { category, count } = req.body;
    const itemId = req.params.id;

    // Validate request body
    if (category !== undefined && typeof category !== 'string') {
      return res.status(400).json({ error: "Category should be a string" });
    }
    if (count !== undefined && (typeof count !== 'number' || count < 0)) {
      return res.status(400).json({ error: "Count should be a positive number" });
    }

    const item = await Product.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update item fields
    if (category !== undefined) item.category = category;
    if (count !== undefined) item.count = count;

    await item.save(); // Save updated item to MongoDB
    res.json({ message: "Item updated successfully", item });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ error: "Error updating item" });
  }
});

// Delete item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await Product.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted successfully", item });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Error deleting item" });
  }
});

// Admin Signup Route
app.post('/admin/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    const token = jwt.sign({ id: newAdmin._id }, process.env.SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Admin registered successfully', token });
  } catch (error) {
    console.error('Error during admin signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
