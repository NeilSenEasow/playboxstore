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
const Admin = require("./models/Admin"); // Ensure this is correct
const Order = require("./models/Order"); // Import the Order model
const Sell = require("./models/Sell"); // Import the Sell model

var passport = require('passport')
var util = require('util')
var PayPalStrategy = require('passport-paypal').Strategy;

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["SECRET", "MONGODB_URI", "VITE_PROD_BASE_URL"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// File path for products
const PRODUCTS_FILE = path.join(__dirname, "data", "products.json");

// File path for main products
const MAIN_PRODUCTS_FILE = path.join(__dirname, "data", "mainProducts.json");

// Function to read products.json
const readProductsFile = async () => {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, "utf8");
    const parsedData = JSON.parse(data);
    
    // Ensure that the parsed data is an array
    if (!Array.isArray(parsedData.featured) && !Array.isArray(parsedData.products) && !Array.isArray(parsedData.games) && !Array.isArray(parsedData.rentItems) && !Array.isArray(parsedData.sellItems)) {
      console.error("Parsed data is not in the expected format:", parsedData);
      return []; // Return an empty array if the data is not in the expected format
    }
    
    return parsedData;
  } catch (err) {
    console.error("Error reading products.json:", err);
    return []; // Return an empty array if file doesn't exist or there is an error
  }
};

// Function to read mainProducts.json
const readMainProductsFile = async () => {
  try {
    const data = await fs.readFile(MAIN_PRODUCTS_FILE, "utf8");
    const parsedData = JSON.parse(data);
    
    // Ensure that the parsed data is an array
    if (!Array.isArray(parsedData)) {
      console.error("Parsed data is not in the expected format:", parsedData);
      return []; // Return an empty array if the data is not in the expected format
    }
    
    return parsedData;
  } catch (err) {
    console.error("Error reading mainProducts.json:", err);
    return []; // Return an empty array if file doesn't exist or there is an error
  }
};

// API root route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
    endpoints: {
      products: `${process.env.VITE_PROD_BASE_URL}/api/products`,
      items: `${process.env.VITE_PROD_BASE_URL}/api/items`,
      mainProducts: `${process.env.VITE_PROD_BASE_URL}/api/mainProducts`, // New endpoint for main products
      register: `${process.env.VITE_PROD_BASE_URL}/auth/register`,
      login: `${process.env.VITE_PROD_BASE_URL}/auth/login`,
      test: `${process.env.VITE_PROD_BASE_URL}/test`,
      baseItems: `${process.env.VITE_PROD_BASE_URL}/api/items`,
      baseProducts: `${process.env.VITE_PROD_BASE_URL}/api/products`,
    },
  });
});

// New route to get main products
app.get("/api/mainProducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
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

// Unified Login Route
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the user is an admin
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isPasswordValid = await admin.comparePassword(password);
      if (isPasswordValid) {
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, isAdmin: true, role: 'admin' }); // Send token and role
      }
    }

    // If not an admin, check if the user exists
    const user = await User.findOne({ email }); 
    if (user) {
      const isPasswordValid = await user.comparePassword(password);
      if (isPasswordValid) {
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, isAdmin: user.role === 'admin', role: user.role }); // Send token and role
      }
    }

    return res.status(400).json({ error: 'Invalid credentials' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    
    // Map old API structure for compatibility
    const mappedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image || 'https://via.placeholder.com/150', // Fallback image
      category: product.category,
      description: product.description,
      condition: product.condition,
      availableQuantity: product.availableQuantity
    }));

    res.json(mappedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Product.find(); // Fetch items from the database
    res.json(items); // Send items as JSON response
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a new item
app.post("/api/items", async (req, res) => {
  try {
    const { name, price, description, condition, availableQuantity, category } = req.body; // Include category
    console.log("Received data:", req.body); // Log the received data

    // Validate input
    if (!name || !price || !description || !condition || availableQuantity === undefined || !category) {
      return res.status(400).json({ error: "All fields (name, price, description, condition, availableQuantity, category) are required" });
    }
    if (typeof name !== 'string' || typeof description !== 'string' || typeof category !== 'string') {
      return res.status(400).json({ error: "Name, description, and category should be strings" });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: "Price should be a positive number" });
    }
    if (condition !== 'new' && condition !== 'used') {
      return res.status(400).json({ error: "Condition must be either 'new' or 'used'" });
    }
    if (typeof availableQuantity !== 'number' || availableQuantity < 0) {
      return res.status(400).json({ error: "Available quantity should be a positive number" });
    }

    const newItem = new Product({ name, price, description, condition, availableQuantity, category }); // Include category
    const savedItem = await newItem.save();

    if (!savedItem) {
      return res.status(500).json({ error: "Failed to add item to the database" });
    }

    res.status(201).json({
      message: "Item added successfully",
      item: {
        _id: savedItem._id, // Ensure _id is included in the response
        name: savedItem.name,
        price: savedItem.price,
        description: savedItem.description,
        condition: savedItem.condition,
        availableQuantity: savedItem.availableQuantity,
        category: savedItem.category // Include category in the response
      },
    });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Error adding item: " + err.message }); // Provide more specific error message
  }
});



app.put("/api/items/:id", async (req, res) => {
  try {
    const { name, count } = req.body;
    const itemId = req.params.id;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    // Validate request body
    if (name !== undefined && typeof name !== "string") {
      return res.status(400).json({ error: "Name should be a string" });
    }
    if (count !== undefined && typeof count !== "number") {
      return res.status(400).json({ error: "Count should be a number" });
    }

    const item = await Product.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update availableQuantity based on count
    if (count !== undefined) {
      const newQuantity = item.availableQuantity + count;
      if (newQuantity < 0) {
        return res.status(400).json({ error: "Insufficient quantity available" });
      }
      item.availableQuantity = newQuantity;
    }

    // Update the name if provided
    if (name) {
      item.name = name;
    }

    await item.save();

    // ✅ Explicitly return the _id and updated product details
    res.json({
      message: "Item updated successfully",
      updatedItem: {
        _id: item._id, // Ensure _id is included in the response
        name: item.name,
        price: item.price,
        description: item.description,
        condition: item.condition,
        availableQuantity: item.availableQuantity,
      },
    });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ error: "Error updating item" });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    // Validate the MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const deletedItem = await Product.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({
      message: "Item deleted successfully",
      deletedItem: {
        _id: deletedItem._id, // Ensure _id is explicitly returned
        name: deletedItem.name,
        price: deletedItem.price,
        description: deletedItem.description,
        condition: deletedItem.condition,
        availableQuantity: deletedItem.availableQuantity,
      },
    });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Error deleting item" });
  }
});

app.delete("/api/items/categories/:categoryName", async (req, res) => {
  const categoryName = req.params.categoryName;

  try {
    // Logic to delete products associated with the category
    const deletedItems = await Product.deleteMany({ category: categoryName });

    if (!deletedItems) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category and associated products deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Error deleting category" });
  }
});

// Example route for admin login
app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Logic to authenticate admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        // Add password verification logic here
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Fetch categories from the database
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch categories from the database
    res.json(categories); // Send categories as JSON response
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Retrieve products with detailed information
app.get("/api/products/aggregate", async (req, res) => {
  try {
    const aggregateResult = await Product.aggregate([
      {
        $group: {
          _id: "$condition", // Group by the condition field
          count: { $sum: 1 }, // Count the number of products for each condition
          products: { $push: { 
              id: "$_id", 
              name: "$name", 
              price: "$price", 
              description: "$description", 
              availableQuantity: "$availableQuantity", 
              category: "$category" 
            } 
          } // Push product details into an array
        }
      }
    ]);

    res.json(aggregateResult); // Send the aggregated results as JSON response
  } catch (error) {
    console.error("Error during aggregation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Retrieve products grouped by category
app.get("/api/products/grouped", async (req, res) => {
  try {
    const aggregateResult = await Product.aggregate([
      {
        $group: {
          _id: "$category", // Group by the category field
          products: { $push: { 
              _id: "$_id", 
              name: "$name", 
              price: "$price", 
              description: "$description", 
              availableQuantity: "$availableQuantity", 
              condition: "$condition" 
            } 
          }, // Push product details into an array
          count: { $sum: 1 } // Count the number of products in each category
        }
      }
    ]);

    res.json(aggregateResult); // Send the aggregated results as JSON response
  } catch (error) {
    console.error("Error during aggregation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user profile based on token
app.get('/api/user/profile', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET); // Verify token
    const user = await User.findById(decoded.id); // Fetch user by ID from token
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return the user data in the desired format
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // address: user.address || 'Address not set',
      // mobile: user.mobile || 'Not set',
      // dateJoined: user.dateJoined || new Date(),
      // wallet: user.wallet || 0,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this route to handle category deletion with its products
app.delete("/api/categories/:categoryName", async (req, res) => {
  const categoryName = req.params.categoryName;

  try {
    // First, delete all products in this category
    const deleteProductsResult = await Product.deleteMany({ category: categoryName });
    
    if (!deleteProductsResult) {
      return res.status(404).json({ 
        error: "No products found in this category",
        categoryName 
      });
    }

    res.json({ 
      message: "Category and associated products deleted successfully",
      deletedProductsCount: deleteProductsResult.deletedCount,
      categoryName
    });
  } catch (err) {
    console.error("Error deleting category and products:", err);
    res.status(500).json({ 
      error: "Error deleting category and products", 
      details: err.message 
    });
  }
});

// Create new order
app.post("/api/orders", async (req, res) => {
  try {
    const { cartItems, userId, orderDetails } = req.body;
    
    // Validate required fields
    if (!cartItems || !userId || !orderDetails) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create orders for each cart item
    const orderPromises = cartItems.map(async (item) => {
      const order = new Order({
        productId: item.id,
        userId: userId,
        quantity: item.quantity || 1,
        status: 'Pending',
        orderDate: new Date(),
        shippingAddress: {
          firstName: orderDetails.firstName,
          lastName: orderDetails.lastName,
          email: orderDetails.email,
          phone: orderDetails.phone,
          address: orderDetails.address,
          street: orderDetails.street,
          city: orderDetails.city,
          district: orderDetails.district,
          state: orderDetails.state,
          zipcode: orderDetails.zipcode,
          landmark: orderDetails.landmark
        }
      });

      // Save the order
      const savedOrder = await order.save();

      // Update product availability
      await Product.findByIdAndUpdate(
        item.id,
        { $inc: { availableQuantity: -(item.quantity || 1) } },
        { new: true }
      );

      return savedOrder;
    });

    // Wait for all orders to be created
    const createdOrders = await Promise.all(orderPromises);

    res.status(201).json({
      message: 'Orders created successfully',
      orders: createdOrders
    });

  } catch (error) {
    console.error('Error creating orders:', error);
    res.status(500).json({ 
      error: 'Failed to create orders',
      details: error.message 
    });
  }
});

// Get all orders (admin only)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('productId')
      .populate('userId', 'name email')
      .sort({ orderDate: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
});

// Get orders for a specific user
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('productId')
      .sort({ orderDate: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
});

// Get specific order by ID
app.get("/api/orders/order/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('productId')
      .populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      error: 'Failed to fetch order',
      details: error.message 
    });
  }
});

// Update order status
app.patch("/api/orders/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    ).populate('productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      error: 'Failed to update order status',
      details: error.message 
    });
  }
});

// Cancel order
app.patch("/api/orders/:orderId/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Can only cancel pending orders' });
    }

    // Update order status to cancelled
    order.status = 'Cancelled';
    await order.save();

    // Restore product quantity
    await Product.findByIdAndUpdate(
      order.productId,
      { $inc: { availableQuantity: order.quantity } }
    );

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ 
      error: 'Failed to cancel order',
      details: error.message 
    });
  }
});

// Add product endpoint
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, description, condition, image, availableQuantity, category } = req.body;

    // Validate required fields
    if (!name || !price || !description || !condition || !image || !availableQuantity || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new product
    const product = new Product({
      name,
      price,
      description,
      condition,
      image,
      availableQuantity,
      category
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product availability
app.patch("/api/products/:productId/availability", async (req, res) => {
  try {
    const { availableQuantity } = req.body;
    const { productId } = req.params;

    if (typeof availableQuantity !== 'number' || availableQuantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity value' });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { availableQuantity },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product availability:', error);
    res.status(500).json({ 
      error: 'Failed to update product availability',
      details: error.message 
    });
  }
});

// Add endpoint to fetch products by category
app.get("/api/products/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Add this new endpoint to get user data
app.get("/api/user", async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Find user by ID (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// Add endpoint to sell a product
app.post("/api/sell-product", async (req, res) => {
  try {
    const { 
      userId, 
      quantity = 1, 
      status = 'Pending', 
      shippingAddress, 
      name, 
      category, 
      condition, 
      description, 
      price, 
      contactNumber, 
      image 
    } = req.body;

    // Validate required fields
    if (!userId || !shippingAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new sell item
    const sellItem = new Sell({
      userId,
      quantity,
      status,
      shippingAddress,
      name,
      category,
      condition,
      description,
      price,
      contactNumber,
      image,
      sellDate: new Date()
    });

    await sellItem.save();
    res.status(201).json(sellItem);
  } catch (error) {
    console.error('Error selling product:', error);
    res.status(500).json({ error: 'Failed to sell product', details: error.message });
  }
});

// Approve a sell product
app.patch("/api/sell-products/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Sell.findByIdAndUpdate(id, { approved: true }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Sell product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error approving sell product:', error);
    res.status(500).json({ error: 'Failed to approve sell product' });
  }
});

// Get all sell products with optional approval filter
app.get("/api/sell-products", async (req, res) => {
  try {
    const { approved } = req.query;
    const filter = approved !== undefined ? { approved: approved === 'true' } : {};
    const sellProducts = await Sell.find(filter);
    res.json(sellProducts);
  } catch (error) {
    console.error('Error fetching sell products:', error);
    res.status(500).json({ error: 'Failed to fetch sell products' });
  }
});

// Payment using PayPal
app.get('/auth/paypal', 
  passport.authenticate('paypal', { failureRedirect: '/login' }));

app.get('/auth/paypal/callback', 
  passport.authenticate('paypal', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

passport.use(new PayPalStrategy({
  returnURL: 'http://localhost:5000/auth/paypal/callback', // Ensure this matches your server URL
  realm: 'http://localhost:5000/'
},
function(identifier, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    profile.identifier = identifier;
    return done(null, profile);
  });
}));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//TRIGGER A CHANGE - FOR render.com
