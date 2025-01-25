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
    condition: 'New'
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

  const handleAddCategory = (e) => {
    e.preventDefault();
    const id = categories.length + 1;
    setCategories([...categories, { ...newCategory, id, products: [] }]);
    setNewCategory({ name: '', slug: '' });
    setShowAddCategory(false);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
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
      condition: 'New'
    });
    setShowAddProduct(false);
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
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn-primary">Add Product</button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setShowAddProduct(false);
                      setSelectedCategory(null);
                    }}
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