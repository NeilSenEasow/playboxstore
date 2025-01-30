import React, { useEffect, useRef, useState } from 'react';
import './Sell.css';

import PS5Image from '../../assets/games/Game1.png';
import XboxImage from '../../assets/games/Game2.png';
import SwitchImage from '../../assets/games/Game3.png';
import PS4Image from '../../assets/games/Game4.png';
import ControllerImage from '../../assets/console/console1.png';
import PS3Image from '../../assets/console/console2.png';

const Sell = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showSellForm, setShowSellForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sellItems, setSellItems] = useState([]);

  useEffect(() => {
    const fetchSellItems = async () => {
      try {
        const apiUrl = import.meta.env.VITE_PROD_BASE_URL + '/api/products' || import.meta.env.VITE_API_URL + '/api/products'; // Use environment variables
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSellItems(data.sellItems); // Assuming the data structure is an array of sell items
      } catch (error) {
        console.error('Error fetching sell items:', error);
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
        {sellItems.map((item, index) => (
          <div 
            key={item.id} 
            className="sell-item"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="sell-item-image-container">
              <img src={item.image} alt={item.name} className="sell-item-image" />
              <span className="condition-badge">{item.condition}</span>
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
        ))}
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