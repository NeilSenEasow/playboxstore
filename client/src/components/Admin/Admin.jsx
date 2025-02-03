import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaChartLine, FaPlus, FaBoxOpen, FaShoppingBag, FaStore, FaClipboardList } from 'react-icons/fa';
import './Admin.css';

const Admin = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    condition: 'new',
    availableQuantity: 0
  });
  const [availabilityCounts, setAvailabilityCounts] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showSellProductsModal, setShowSellProductsModal] = useState(false);
  const [showSellOrdersModal, setShowSellOrdersModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [sellProducts, setSellProducts] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);

  // Check authentication status on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  // Fetch grouped products from the database
  useEffect(() => {
    const fetchGroupedProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL || import.meta.env.VITE_API_URL}/api/products/grouped`);
        if (!response.ok) {
          throw new Error('Failed to fetch grouped products');
        }
        const data = await response.json();
        // Process the grouped data to set it in state
        setCategories(data.map(item => ({
          name: item._id, // Category name
          count: item.count,
          products: item.products // Array of products under this category
        })));
        console.log('Fetched grouped products:', data);
      } catch (error) {
        console.error('Error fetching grouped products:', error);
      }
    };

    fetchGroupedProducts();
  }, []);

  // Save categories to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

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
    const updatedCategories = [...categories, { ...newCategory, id, products: [] }];
    setCategories(updatedCategories);
    setNewCategory({ name: '', slug: '' });
    setShowAddCategory(false);
  };

  // Add a new product to a selected category
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      condition: newProduct.condition,
      availableQuantity: parseInt(newProduct.availableQuantity, 10),
      category: selectedCategory.name
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL || import.meta.env.VITE_API_URL}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to add product to API');
      }

      const data = await response.json();
      const updatedCategories = categories.map(cat => {
        if (cat.id === selectedCategory.id) {
          return {
            ...cat,
            products: [...cat.products, { ...productData, _id: data.item._id }]
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        condition: 'new',
        availableQuantity: 0
      });
      setShowAddProduct(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Update product availability
  const handleUpdateAvailability = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL || import.meta.env.VITE_API_URL}/api/items/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: availabilityCounts[productId] || 0 }), 
      });
      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      // Update the local state if needed
      const updatedCategories = categories.map(category => {
        category.products = category.products.map(product =>
          product._id === productId ? { ...product, availableQuantity: product.availableQuantity + (availabilityCounts[productId] || 0) } : product
        );
        return category;
      });
      setCategories(updatedCategories);
      
      // Reset only the specific product's count
      setAvailabilityCounts(prev => ({
        ...prev,
        [productId]: 0
      }));
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  // Remove a product from a category
  const handleRemoveProduct = async (categoryId, productId) => {
    console.log("Attempting to delete product with ID:", productId);
    if (!productId) {
      console.error("No product ID provided for deletion.");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL || import.meta.env.VITE_API_URL}/api/items/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to delete item');
      }

      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            products: cat.products.filter(product => product._id !== productId)
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  // Remove a category and its products
  const handleRemoveCategory = async (categoryId) => {
    // Find the category to delete based on the categoryId
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (!categoryToDelete) return;

    try {
      // Send DELETE request to the server to remove items by category
      const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL || import.meta.env.VITE_API_URL}/api/items/categories/${categoryToDelete.name}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      // Update the local state to remove the deleted category
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error removing category:', error);
    }
  };

  // Show products in a modal
  const handleShowProducts = (category) => {
    setSelectedCategory(category);
    setShowProductModal(true);
    // Initialize availability counts for all products to 0
    const initialCounts = {};
    category.products.forEach(product => {
      initialCounts[product._id] = 0;
    });
    setAvailabilityCounts(initialCounts);
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
        {/* <div className="chart-card">
          <h3>Monthly Revenue</h3>
          <div className="chart-placeholder">
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
        </div> */}

        {/* <div className="chart-card">
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
        </div> */}
      </div>

      <div className="admin-section">
        <div className="admin-buttons-grid">
          <button 
            className="admin-section-button"
            onClick={() => setShowAddCategory(true)}
          >
            <FaBoxOpen />
            <span>Category Management</span>
          </button>

          <button 
            className="admin-section-button"
            onClick={() => setShowOrdersModal(true)}
          >
            <FaShoppingBag />
            <span>Orders</span>
          </button>

          <button 
            className="admin-section-button"
            onClick={() => setShowSellProductsModal(true)}
          >
            <FaStore />
            <span>Sell Products</span>
          </button>

          <button 
            className="admin-section-button"
            onClick={() => setShowSellOrdersModal(true)}
          >
            <FaClipboardList />
            <span>Sell Orders</span>
          </button>
        </div>

        {/* Category Management Modal */}
        {showAddCategory && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Category Management</h3>
              <div className="categories-grid" style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
                {categories.map(category => (
                  <div key={category.name} className="category-card">
                    <h3>{category.name} ({category.count})</h3>
                    <p>{category.products.length} Products</p>
                    <div className="form-buttons">
                      <button 
                        className="btn-secondary"
                        onClick={() => handleShowProducts(category)}
                      >
                        View Products
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowAddProduct(true);
                        }}
                      >
                        Add Product
                      </button>
                    </div>
                    <button 
                      className="btn-danger"
                      onClick={() => handleRemoveCategory(category.name)}
                    >
                      Remove Category
                    </button>
                  </div>
                ))}
              </div>
              <button 
                className="btn-secondary"
                onClick={() => setShowAddCategory(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Orders Modal */}
        {showOrdersModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Orders Management</h3>
              <div className="orders-tabs">
                <button className="tab-button active">Pending</button>
                <button className="tab-button">In Progress</button>
                <button className="tab-button">Completed</button>
              </div>
              <div className="orders-list" style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <h4>Order #{order.id}</h4>
                    <p>Status: {order.status}</p>
                    <p>Total: ₹{order.total}</p>
                    <button className="btn-primary">Update Status</button>
                  </div>
                ))}
              </div>
              <button 
                className="btn-secondary"
                onClick={() => setShowOrdersModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Sell Products Modal */}
        {showSellProductsModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Sell Products Management</h3>
              <div className="sell-products-list" style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
                {sellProducts.map(product => (
                  <div key={product.id} className="sell-product-card">
                    <h4>{product.name}</h4>
                    <p>Price: ₹{product.price}</p>
                    <p>Condition: {product.condition}</p>
                    <div className="status-controls">
                      <button className="btn-primary">Approve</button>
                      <button className="btn-danger">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="btn-secondary"
                onClick={() => setShowSellProductsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Sell Orders Modal */}
        {showSellOrdersModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Sell Orders Management</h3>
              <div className="sell-orders-tabs">
                <button className="tab-button active">Pending</button>
                <button className="tab-button">In Progress</button>
                <button className="tab-button">Completed</button>
              </div>
              <div className="sell-orders-list" style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
                {sellOrders.map(order => (
                  <div key={order.id} className="sell-order-card">
                    <h4>Sell Order #{order.id}</h4>
                    <p>Item: {order.itemName}</p>
                    <p>Status: {order.status}</p>
                    <p>Offered Price: ₹{order.price}</p>
                    <button className="btn-primary">Update Status</button>
                  </div>
                ))}
              </div>
              <button 
                className="btn-secondary"
                onClick={() => setShowSellOrdersModal(false)}
              >
                Close
              </button>
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
                  <label>Condition</label>
                  <select
                    value={newProduct.condition}
                    onChange={(e) => setNewProduct({...newProduct, condition: e.target.value})}
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
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

        {showProductModal && selectedCategory && (
          <div className="modal-overlay">
            <div className="modal" style={{textAlign: 'center'}}>
              <h3>Products in {selectedCategory.name}</h3>
              <div style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
                {selectedCategory.products.length > 0 ? (
                  selectedCategory.products.map(product => (
                    <div key={product._id} className="product-card" style={{textAlign: 'center'}}>
                      <h4>{product.name}</h4>
                      <p>₹{product.price}</p>
                      <button 
                        className="btn-danger"
                        onClick={() => handleRemoveProduct(selectedCategory.name, product._id)}
                      >
                        Remove Product
                      </button>
                      <div className="availability-controls" style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                        <button 
                          className="btn-inc-aval"
                          onClick={() => setAvailabilityCounts(prev => ({
                            ...prev,
                            [product._id]: (prev[product._id] || 0) + 1
                          }))}
                        >
                          +
                        </button>
                        <span>{availabilityCounts[product._id] || 0}</span>
                        <button 
                          className="btn-inc-aval"
                          onClick={() => setAvailabilityCounts(prev => ({
                            ...prev,
                            [product._id]: Math.max((prev[product._id] || 0) - 1, 0)
                          }))}
                        >
                          -
                        </button>
                        <button 
                          className="btn-inc-aval"
                          onClick={() => handleUpdateAvailability(product._id)}
                        >
                          Update Availability
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products in this category.</p>
                )}
              </div>
              <button 
                className="btn-secondary"
                onClick={() => setShowProductModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;