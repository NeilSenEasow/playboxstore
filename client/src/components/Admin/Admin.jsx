import React, { useState, useEffect, useRef } from 'react';
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
    image: '',
    availableQuantity: '',
    category: ''
  });
  const [availabilityCounts, setAvailabilityCounts] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showSellProductsModal, setShowSellProductsModal] = useState(false);
  const [showSellOrdersModal, setShowSellOrdersModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [sellProducts, setSellProducts] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Refs for modal content
  const categoryModalRef = useRef(null);
  const productModalRef = useRef(null);
  const ordersModalRef = useRef(null);
  const sellProductsModalRef = useRef(null);
  const sellOrdersModalRef = useRef(null);
  const addProductModalRef = useRef(null);

  // Check authentication status on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  // // Fetch grouped products from the database
  // useEffect(() => {
  //   const fetchGroupedProducts = async () => {
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/products/grouped`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch grouped products');
  //       }
  //       const data = await response.json();
  //       // Process the grouped data to set it in state
  //       setCategories(data.map(item => ({
  //         name: item._id, // Category name
  //         count: item.count,
  //         products: item.products // Array of products under this category
  //       })));
  //       console.log('Fetched grouped products:', data);
  //     } catch (error) {
  //       console.error('Error fetching grouped products:', error);
  //     }
  //   };

  //   fetchGroupedProducts();
  // }, []);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data); // Set the fetched products
        console.log('Fetched products:', data); // Log the fetched products for debugging
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchGroupedProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/products/grouped`);
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

    // Call the fetch functions
    fetchProducts();
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

  // Add this after other useEffect hooks
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PROD_BASE_URL}/api/orders`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAddCategory && categoryModalRef.current && !categoryModalRef.current.contains(event.target)) {
        setShowAddCategory(false);
      }
      if (showProductModal && productModalRef.current && !productModalRef.current.contains(event.target)) {
        setShowProductModal(false);
      }
      if (showOrdersModal && ordersModalRef.current && !ordersModalRef.current.contains(event.target)) {
        setShowOrdersModal(false);
      }
      if (showSellProductsModal && sellProductsModalRef.current && !sellProductsModalRef.current.contains(event.target)) {
        setShowSellProductsModal(false);
      }
      if (showSellOrdersModal && sellOrdersModalRef.current && !sellOrdersModalRef.current.contains(event.target)) {
        setShowSellOrdersModal(false);
      }
      if (showAddProduct && addProductModalRef.current && !addProductModalRef.current.contains(event.target)) {
        setShowAddProduct(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddCategory, showProductModal, showOrdersModal, showSellProductsModal, showSellOrdersModal, showAddProduct]);

  // Add a new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    const id = categories.length + 1;
    const updatedCategories = [...categories, { ...newCategory, id, products: [] }];
    setCategories(updatedCategories);
    setNewCategory({ name: '', slug: '' });
  };

  // Add a new product to a selected category
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        condition: newProduct.condition,
        image: newProduct.image,
        availableQuantity: parseInt(newProduct.availableQuantity, 10),
        category: selectedCategory.name
      };
      const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const savedProduct = await response.json();

      // Update local state
      setCategories(categories.map(cat => {
        if (cat.name === selectedCategory.name) {
          return {
            ...cat,
            products: [...cat.products, savedProduct]
          };
        }
        return cat;
      }));

      // Reset form
      setNewProduct({
        name: '',
        price: '',
        description: '',
        condition: 'new',
        image: '',
        availableQuantity: '',
        category: ''
      });
      setShowAddProduct(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  // Update product availability
  const handleUpdateAvailability = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/products/${productId}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          availableQuantity: availabilityCounts[productId] || 0 
        }), 
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      const updatedProduct = await response.json();

      // Update the local state
      setCategories(categories.map(cat => ({
        ...cat,
        products: cat.products.map(prod => 
          prod._id === productId 
            ? { ...prod, availableQuantity: updatedProduct.availableQuantity }
            : prod
        )
      })));
      
      // Reset the count for this product
      setAvailabilityCounts(prev => ({
        ...prev,
        [productId]: 0
      }));

      alert('Product quantity updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update product quantity. Please try again.');
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
      const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/items/${productId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
  const handleRemoveCategory = async (categoryName) => {
    if (!window.confirm(`Are you sure you want to delete the category "${categoryName}" and all its products?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PROD_BASE_URL}/api/categories/${categoryName}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      const result = await response.json();
      console.log('Delete result:', result);

      // Update the local state to remove the category and its products
      setCategories(prevCategories => 
        prevCategories.filter(cat => cat.name !== categoryName)
      );

      // Show success message
      alert(`Successfully deleted category "${categoryName}" and ${result.deletedProductsCount} products`);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(`Failed to delete category: ${error.message}`);
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
            <div ref={categoryModalRef} className="modal" style={{ width: '80%', maxWidth: '1200px', maxHeight: '90vh', overflow: 'auto' }}>
              <h3>Category Management</h3>
              
              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} style={{ marginBottom: '20px' }}>
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">Add Category</button>
              </form>

              <div className="categories-grid" style={{ maxHeight: 'calc(90vh - 250px)', overflowY: 'auto', overflowX: 'hidden' }}>
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
            <div ref={ordersModalRef} className="modal" style={{ width: '80%', maxWidth: '1200px' }}>
              <h3>Orders Management</h3>
              <div className="orders-tabs">
                <button className="tab-button active">Pending</button>
                <button className="tab-button">In Progress</button>
                <button className="tab-button">Completed</button>
              </div>
              <div className="orders-section">
                <h3>Recent Orders</h3>
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <span>Order ID: {order._id}</span>
                        <span className={`order-status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-details">
                        <p>Product: {order.productId?.name || 'Product Not Found'}</p>
                        <p>Quantity: {order.quantity}</p>
                        <p>Customer: {order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                      <div className="order-actions">
                        <select 
                          value={order.status}
                          onChange={async (e) => {
                            try {
                              const response = await fetch(
                                `${import.meta.env.VITE_PROD_BASE_URL}/api/orders/${order._id}/status`,
                                {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                  },
                                  body: JSON.stringify({ status: e.target.value }),
                                }
                              );
                              if (!response.ok) throw new Error('Failed to update status');
                              
                              // Refresh orders after status update
                              const updatedOrders = orders.map(o => 
                                o._id === order._id ? { ...o, status: e.target.value } : o
                              );
                              setOrders(updatedOrders);
                            } catch (error) {
                              console.error('Error updating order status:', error);
                            }
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
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
            <div ref={sellProductsModalRef} className="modal" style={{ width: '80%', maxWidth: '1200px' }}>
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
            <div ref={sellOrdersModalRef} className="modal" style={{ width: '80%', maxWidth: '1200px' }}>
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
            <div ref={addProductModalRef} className="modal">
              <div className="modal-content">
                <h3>Add Product to {selectedCategory.name}</h3>
                <form onSubmit={handleAddProduct}>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                      style={{ width: '92%' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required
                      style={{ width: '92%' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      required
                      style={{ width: '92%' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Condition</label>
                    <select
                      value={newProduct.condition}
                      onChange={(e) => setNewProduct({...newProduct, condition: e.target.value})}
                      style={{ width: '92%' }}
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        image: e.target.value
                      }))}
                      placeholder="Enter product image URL"
                      required
                    />
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
                      style={{ width: '92%' }}
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
              {newProduct.image && (
                <div className="image-preview">
                  <img 
                    src={newProduct.image} 
                    alt="Product preview" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'placeholder-image-url';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {showProductModal && selectedCategory && (
          <div className="modal-overlay">
            <div ref={productModalRef} className="modal">
              <h3>Products in {selectedCategory.name}</h3>
              <div className="products-list">
                {selectedCategory.products.map(product => (
                  <div key={product._id} className="product-list-item">
                    {/* <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100'; // Fallback image
                      }}
                    /> */}
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>₹{product.price.toLocaleString()}</p>
                      <p>Quantity: {product.availableQuantity}</p>
                      <p>Condition: {product.condition}</p>
                      <p className="description">{product.description}</p>
                      <div className="availability-controls">
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
                          className="btn-update"
                          onClick={() => handleUpdateAvailability(product._id)}
                        >
                          Update Quantity
                        </button>
                      </div>
                    </div>
                    <div className="product-actions">
                      <button 
                        className="btn-danger"
                        onClick={() => handleRemoveProduct(selectedCategory.name, product._id)}
                      >
                        Remove
                      </button>
                      {/* <button 
                        className="btn-secondary"
                        onClick={() => {
                          setSelectedCategory(selectedCategory);
                          setShowAddProduct(true);
                          setShowProductModal(false);
                        }}
                      >
                        Edit
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowProductModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;