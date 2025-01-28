import React, { useState } from 'react';
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaChartLine, FaPlus } from 'react-icons/fa';
import './Admin.css';

const Admin = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'PS5', slug: 'ps5', products: [] },
    { id: 2, name: 'PS4', slug: 'ps4', products: [] },
    { id: 3, name: 'Xbox', slug: 'xbox', products: [] }
  ]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    condition: 'New',
    availableQuantity: 0
  });

  // Dummy data for demonstration
  const statistics = {
    totalUsers: 97400,
    activeUsers: 42500,
    totalSales: 65400,
    growthRate: 78.4,
    monthlyRevenue: [12, 38, 32, 48, 24, 18, 20, 34, 14],
    deviceTypes: {
      desktop: 35,
      tablet: 48,
      mobile: 27
    },
    totalClicks: 82700,
    totalViews: 68400
  };

  // Add a new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    const id = categories.length + 1;
    setCategories([...categories, { ...newCategory, id, products: [] }]);
    setNewCategory({ name: '', slug: '' });
    setShowAddCategory(false);
  };

  // Add a new product to a selected category
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Send the new product to the backend
    try {
      console.log("Adding product with data:", {
        name: newProduct.name,
        category: selectedCategory.name,
        count: newProduct.availableQuantity,
      });
      const response = await fetch("http://localhost:5001/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProduct.name,
          category: selectedCategory.name,
          count: newProduct.availableQuantity,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      const data = await response.json();
      console.log(data);

      // Update local categories state after successful API call
      const updatedCategories = categories.map(cat => {
        if (cat.id === selectedCategory.id) {
          return {
            ...cat,
            products: [...cat.products, { ...newProduct, id: cat.products.length + 1 }]
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        image: '',
        condition: 'New',
        availableQuantity: 0
      });
      setShowAddProduct(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Update product availability
  const handleUpdateAvailability = async (productId, newQuantity) => {
    try {
      const response = await fetch(`${process.env.APP_URL}/api/products/${productId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availableQuantity: newQuantity }),
      });
      if (!response.ok) {
        throw new Error('Failed to update availability');
      }
      // Update the local state if needed
      const updatedCategories = categories.map(category => {
        category.products = category.products.map(product =>
          product.id === productId ? { ...product, availableQuantity: newQuantity } : product
        );
        return category;
      });
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  // Remove a product from a category
  const handleRemoveProduct = (categoryId, productId) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          products: cat.products.filter(product => product.id !== productId)
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
  };

  // Remove a category and its products
  const handleRemoveCategory = (categoryId) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProduct.name,
          category: selectedCategory.name,
          count: newProduct.availableQuantity,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
      const data = await response.json();
      console.log(data);
      // Optionally update local state to reflect the new item
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Update item
  const handleUpdateItem = async (itemId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      const data = await response.json();
      console.log(data);
      // Optionally update local state to reflect the updated item
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/items/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      const data = await response.json();
      console.log(data);
      // Optionally update local state to reflect the deleted item
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Admin!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p>{statistics.totalUsers.toLocaleString()}</p>
            <span className="stat-change positive">+12.5% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p>₹{statistics.totalSales.toLocaleString()}</p>
            <span className="stat-change positive">+8.3% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p>₹{(statistics.totalSales * 0.8).toLocaleString()}</p>
            <span className="stat-change positive">+15.2% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Growth Rate</h3>
            <p>{statistics.growthRate}%</p>
            <span className="stat-change positive">+5.7% from last month</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Monthly Revenue</h3>
          <div className="chart-placeholder">
            {/* Add actual chart library implementation later */}
            <div className="bar-chart">
              {statistics.monthlyRevenue.map((value, index) => (
                <div 
                  key={index} 
                  className="bar" 
                  style={{ height: `${value}%` }}
                  title={`Month ${index + 1}: ${value}k`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Device Distribution</h3>
          <div className="device-stats">
            <div className="device-stat">
              <span>Desktop</span>
              <div className="progress-bar">
                <div style={{ width: `${statistics.deviceTypes.desktop}%` }} />
              </div>
              <span>{statistics.deviceTypes.desktop}%</span>
            </div>
            <div className="device-stat">
              <span>Tablet</span>
              <div className="progress-bar">
                <div style={{ width: `${statistics.deviceTypes.tablet}%` }} />
              </div>
              <span>{statistics.deviceTypes.tablet}%</span>
            </div>
            <div className="device-stat">
              <span>Mobile</span>
              <div className="progress-bar">
                <div style={{ width: `${statistics.deviceTypes.mobile}%` }} />
              </div>
              <span>{statistics.deviceTypes.mobile}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h2>Category Management</h2>
          <button 
            className="add-button"
            onClick={() => setShowAddCategory(true)}
          >
            <FaPlus /> Add Category
          </button>
        </div>

        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <h3>{category.name}</h3>
              <p>{category.products.length} Products</p>
              <button 
                className="btn-secondary"
                onClick={() => {
                  setSelectedCategory(category);
                  setShowAddProduct(true);
                }}
              >
                Add Product
              </button>
              <button 
                className="btn-danger"
                onClick={() => handleRemoveCategory(category.id)}
              >
                Remove Category
              </button>

              {category.products.map(product => (
                <div key={product.id} className="product-card">
                  <h4>{product.name}</h4>
                  <p>₹{product.price}</p>
                  <button 
                    className="btn-danger"
                    onClick={() => handleRemoveProduct(category.id, product.id)}
                  >
                    Remove Product
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => handleUpdateAvailability(product.id, product.availableQuantity + 1)}
                  >
                    Increase Availability
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {showAddCategory && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Category</h3>
              <form onSubmit={handleAddCategory}>
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({
                      ...newCategory,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                    })}
                    required
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn-primary">Add Category</button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowAddCategory(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddProduct && selectedCategory && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add Product to {selectedCategory.name}</h3>
              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Condition</label>
                  <select
                    value={newProduct.condition}
                    onChange={(e) => setNewProduct({...newProduct, condition: e.target.value})}
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Available Quantity</label>
                  <input
                    type="number"
                    value={newProduct.availableQuantity}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                      availableQuantity: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn-primary">Add Product</button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAddProduct(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;