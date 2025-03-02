import React, { useEffect, useRef, useState } from 'react';
import './Sell.css';

const Sell = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showSellForm, setShowSellForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sellItems, setSellItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSellItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Filter items that can be sold
        const sellableItems = data.filter(item => 
          item.category === 'Consoles' || 
          item.category === 'Games'
        );
        setSellItems(sellableItems);
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

  const SellForm = ({ item, onClose }) => (
    <div className="sell-form-overlay">
      <div className="sell-form">
        <h2>Sell Similar Item</h2>
        <p>Reference Item: {item.name}</p>
        <form>
          <div className="form-group">
            <label>Item Condition</label>
            <select required>
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
              placeholder="Describe your item's condition, included accessories, etc."
              required
            />
          </div>
          <div className="form-group">
            <label>Your Price (₹)</label>
            <input 
              type="number" 
              placeholder="Enter your asking price"
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input 
              type="tel" 
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

  return (
    <div className={`sell-container ${isVisible ? 'animate-section' : ''}`} ref={sectionRef}>
      <h1 className="sell-title">
        Pre-Owned <span className="highlight">Gaming Gear</span>
      </h1>
      <p className="sell-subtitle">Want to sell your gaming gear? Check out similar items below!</p>
      
      <div className="sell-items">
        {isLoading ? (
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
                <p className="sell-item-price">₹{item.price.toLocaleString()}</p>
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