import React, { useEffect, useRef, useState } from 'react';
import './Sell.css';

const Sell = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showSellForm, setShowSellForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sellItems, setSellItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    condition: '',
    description: '',
    price: '',
    contactNumber: '',
    image: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null });

  useEffect(() => {
    const fetchSellItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sell-products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched sell items:', data);
        setSellItems(data);
      } catch (error) {
        console.error('Error fetching sell items:', error);
        setSellItems([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellItems();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSellClick = (item) => {
    setSelectedItem(item);
    setShowSellForm(true);
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNewItemSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/sell-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to submit item');
      }

      const result = await response.json();
      console.log('New item submitted:', result);
      
      // Reset the form and show success message
      setNewItem({
        name: '',
        category: '',
        condition: '',
        description: '',
        price: '',
        contactNumber: '',
        image: ''
      });
      setSubmitStatus({ success: true, error: null });
      
      // Refresh the list of items
      const updatedResponse = await fetch('http://localhost:5000/api/sell-products');
      const updatedData = await updatedResponse.json();
      setSellItems(updatedData);
    } catch (error) {
      console.error('Error submitting new item:', error);
      setSubmitStatus({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/sell-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          referencedItem: selectedItem._id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit item');
      }

      const result = await response.json();
      console.log('Similar item submitted:', result);
      
      // Close the form and refresh the list
      setShowSellForm(false);
      setSelectedItem(null);
      
      // Refresh the list of items
      const updatedResponse = await fetch('http://localhost:5000/api/sell-products');
      const updatedData = await updatedResponse.json();
      setSellItems(updatedData);
      
      setSubmitStatus({ success: true, error: null });
    } catch (error) {
      console.error('Error submitting similar item:', error);
      setSubmitStatus({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const SellForm = ({ item, onClose }) => {
    const [formData, setFormData] = useState({
      name: `${item.name} (Similar)`,
      category: item.category,
      condition: '',
      description: '',
      price: '',
      contactNumber: '',
      image: item.image
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSellFormSubmit(formData);
    };

    return (
      <div className="sell-form-overlay">
        <div className="sell-form">
          <h2>Sell Similar Item</h2>
          <p>Reference Item: {item.name}</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Item Condition</label>
              <select 
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required 
                className='condition'
              >
                <option value="">Select Condition</option>
                <option value="like-new">Like New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item's condition, included accessories, etc."
                required
              />
            </div>
            <div className="form-group">
              <label>Your Price (₹)</label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter your asking price"
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input 
                type="tel" 
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter your contact number"
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">Submit</button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={`sell-container ${isVisible ? 'animate-section' : ''}`} ref={sectionRef}>
      <h1 className="sell-title">
        Pre-Owned <span className="highlight">Gaming Gear</span>
      </h1>
      <p className="sell-subtitle">Want to sell your gaming gear? Check out similar items below!</p>

      {/* Status Messages */}
      {submitStatus.success && (
        <div className="success-message">
          Item submitted successfully! Our team will review it shortly.
        </div>
      )}
      {submitStatus.error && (
        <div className="error-message">
          Error: {submitStatus.error}
        </div>
      )}

      {/* New Item Form */}
      <form onSubmit={handleNewItemSubmit} className="new-item-form">
        <h2>Sell Your Item</h2>
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleNewItemChange}
            placeholder="Enter item name"
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={newItem.category} onChange={handleNewItemChange} required>
            <option value="">Select Category</option>
            <option value="Consoles">Consoles</option>
            <option value="Games">Games</option>
          </select>
        </div>
        <div className="form-group">
          <label>Item Condition</label>
          <select name="condition" value={newItem.condition} onChange={handleNewItemChange} required>
            <option value="">Select Condition</option>
            <option value="like-new">Like New</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="description"
            value={newItem.description}
            onChange={handleNewItemChange}
            placeholder="Describe your item's condition, included accessories, etc."
            required
          />
        </div>
        <div className="form-group">
          <label>Your Price (₹)</label>
          <input 
            type="number" 
            name="price"
            value={newItem.price}
            onChange={handleNewItemChange}
            placeholder="Enter your asking price"
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input 
            type="tel" 
            name="contactNumber"
            value={newItem.contactNumber}
            onChange={handleNewItemChange}
            placeholder="Enter your contact number"
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input 
            type="url" 
            name="image"
            value={newItem.image}
            onChange={handleNewItemChange}
            placeholder="Enter image URL"
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      <div className="sell-items">
        {isLoading && !sellItems.length ? (
          <div className="loading-spinner"></div>
        ) : sellItems.length > 0 ? (
          sellItems.map((item, index) => (
            <div 
              key={item._id || index} 
              className="sell-item"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="sell-item-image-container">
                <img src={item.image} alt={item.name} className="sell-item-image" />
                <span className="condition-badge">{item.condition || 'Used'}</span>
              </div>
              <div className="sell-item-content">
                <h3 className="sell-item-name">{item.name}</h3>
                <p className="sell-item-description">{item.description || 'No description available'}</p>
                <p className="sell-item-price">₹{typeof item.price === 'number' ? item.price.toLocaleString() : item.price}</p>
                <div className="sell-item-buttons">
                  <button 
                    className="btn-primary"
                    onClick={() => handleSellClick(item)}
                  >
                    Sell Similar Item
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-items-message">
            <p>No items available for sale at the moment.</p>
          </div>
        )}
      </div>

      {showSellForm && selectedItem && (
        <SellForm 
          item={selectedItem} 
          onClose={() => {
            setShowSellForm(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default Sell;