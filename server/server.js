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

// Function to write to products.json
const writeProductsFile = async (products) => {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error("Error writing products.json:", err);
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

// Function to write to items.json
const writeItemsFile = async (items) => {
  try {
    await fs.writeFile(ITEMS_FILE, JSON.stringify(items, null, 2));
  } catch (err) {
    console.error("Error writing items.json:", err);
  }
};

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
  const products = await readProductsFile();
  res.json(products);
});

// Get all items
app.get("/api/items", async (req, res) => {
  const items = await readItemsFile();
  res.json(items);
});

// Add a new product
app.post("/api/products", async (req, res) => {
  try {
    const { name, category, count } = req.body;

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

    const products = await readProductsFile();
    const newProduct = { id: Date.now(), name, category, count };

    products.push(newProduct);
    await writeProductsFile(products);

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Error adding product" });
  }
});

// Update product
app.put("/api/products/:id", async (req, res) => {
  try {
    const { category, count } = req.body;
    const productId = parseInt(req.params.id);

    // Validate request body
    if (category !== undefined && typeof category !== 'string') {
      return res.status(400).json({ error: "Category should be a string" });
    }
    if (count !== undefined && (typeof count !== 'number' || count < 0)) {
      return res.status(400).json({ error: "Count should be a positive number" });
    }

    let products = await readProductsFile();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product fields
    if (category !== undefined) products[productIndex].category = category;
    if (count !== undefined) products[productIndex].count = count;

    await writeProductsFile(products);
    res.json({ message: "Product updated successfully", product: products[productIndex] });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Error updating product" });
  }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    let products = await readProductsFile();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    await writeProductsFile(products);

    res.json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

// Add a new item
app.post("/api/items", async (req, res) => {
  try {
    const { name, category, count } = req.body;

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

    const items = await readItemsFile();
    const newItem = { id: Date.now(), name, category, count };

    items.push(newItem);
    await writeItemsFile(items);

    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Error adding item" });
  }
});

// Update item
app.put("/api/items/:id", async (req, res) => {
  try {
    const { category, count } = req.body;
    const itemId = parseInt(req.params.id);

    // Validate request body
    if (category !== undefined && typeof category !== 'string') {
      return res.status(400).json({ error: "Category should be a string" });
    }
    if (count !== undefined && (typeof count !== 'number' || count < 0)) {
      return res.status(400).json({ error: "Count should be a positive number" });
    }

    let items = await readItemsFile();
    const itemIndex = items.findIndex((i) => i.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update item fields
    if (category !== undefined) items[itemIndex].category = category;
    if (count !== undefined) items[itemIndex].count = count;

    await writeItemsFile(items);
    res.json({ message: "Item updated successfully", item: items[itemIndex] });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ error: "Error updating item" });
  }
});

// Delete item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);

    let items = await readItemsFile();
    const itemIndex = items.findIndex((i) => i.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    const deletedItem = items.splice(itemIndex, 1)[0];
    await writeItemsFile(items);

    res.json({ message: "Item deleted successfully", item: deletedItem });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Error deleting item" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
