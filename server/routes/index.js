const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin'); // Import Admin model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Order = require('../models/Order');

router.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

router.post('/auth/signin', async (req, res) => {
  console.log("Received request body:", req.body); // Debugging step

  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    console.error("Email or password missing");
    return res.status(400).json({ message: 'Email and password are required' });
  }

  console.log('Sign-in attempt:', { email, password }); // Log the received credentials

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match for email:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Server error during sign-in' });
  }
});

// Create a new order
router.post('/orders', async (req, res) => {
  const { productId, quantity, userId } = req.body;
  try {
    const order = new Order({ productId, quantity, userId });
    await order.save();

    // Update product availability
    await Product.findByIdAndUpdate(productId, { $inc: { availableQuantity: -quantity } });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('productId userId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Update product availability
router.put('/products/:id/availability', async (req, res) => {
  const { availableQuantity } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { availableQuantity }, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product availability' });
  }
});

// ✅ Admin Signup Route - Stores in `admins` collection
router.post('/admin/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    // Check if email exists in both User and Admin collections
    const existingUser = await User.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const newAdmin = new Admin({ name, email, password }); // Mongoose will hash it automatically
    await newAdmin.save();

    const token = jwt.sign({ id: newAdmin._id }, process.env.SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Admin registered successfully', token });
  } catch (error) {
    console.error('Error during admin signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Admin Login Route - Uses `admins` collection
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;