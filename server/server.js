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
// const Category = require("./models/Category"); // Import the Category model

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
const port = process.env.PORT || 5001;

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

// File path for items
const ITEMS_FILE = path.join(__dirname, "data", "items.json");

// Function to read items.json
const readItemsFile = async () => {
  try {
    const data = await fs.readFile(ITEMS_FILE, "utf8");
    const parsedData = JSON.parse(data);
    
    // Ensure that the parsed data is an array
    if (!Array.isArray(parsedData)) {
      console.error("Parsed data is not in the expected format:", parsedData);
      return []; // Return an empty array if the data is not in the expected format
    }
    
    return parsedData;
  } catch (err) {
    console.error("Error reading items.json:", err);
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
      register: `${process.env.VITE_PROD_BASE_URL}/auth/register`,
      login: `${process.env.VITE_PROD_BASE_URL}/auth/login`,
      test: `${process.env.VITE_PROD_BASE_URL}/test`,
      baseItems: `${process.env.VITE_PROD_BASE_URL}/api/items`,
      baseProducts: `${process.env.VITE_PROD_BASE_URL}/api/products`,
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
  const products = await readProductsFile();
  res.json(products);
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//TRIGGER A CHANGE - FOR render.com