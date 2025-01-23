import React, { useEffect, useRef, useState } from 'react';
import './Sell.css';

import PS5Image from '../../assets/games/Game1.png';
import XboxImage from '../../assets/games/Game2.png';
import SwitchImage from '../../assets/games/Game3.png';
import PS4Image from '../../assets/games/Game4.png';
import ControllerImage from '../../assets/console/console1.png';
import PS3Image from '../../assets/console/console2.png';

export const sellItems = [
  { 
    id: 1, 
    name: 'PlayStation 5', 
    price: '₹35,000',
    condition: 'Like New',
    description: '1 Year Old | All Accessories Included',
    image: PS5Image 
  },
  { 
    id: 2, 
    name: 'Xbox Series X', 
    price: '₹32,999',
    condition: 'Excellent',
    description: '2 Controllers | Game Pass Included',
    image: XboxImage 
  },
  { 
    id: 3, 
    name: 'Nintendo Switch', 
    price: '₹22,999',
    condition: 'Good',
    description: '3 Games Included | Extra Joy-Cons',
    image: SwitchImage 
  },
  { 
    id: 4, 
    name: 'PlayStation 4 Pro', 
    price: '₹21,999',
    condition: 'Very Good',
    description: '500GB | 2 Controllers | 5 Games',
    image: PS4Image 
  },
  { 
    id: 5, 
    name: 'DualSense Controller', 
    price: '₹4,999',
    condition: 'Like New',
    description: 'PS5 Controller | White | Original Box',
    image: ControllerImage 
  },
  { 
    id: 6, 
    name: 'PlayStation 3', 
    price: '₹12,999',
    condition: 'Good',
    description: 'Classic Console | 10 Games Bundle',
    image: PS3Image 
  }
];

const Sell = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showSellForm, setShowSellForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
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
              <p className="sell-item-description">{item.description}</p>
              <p className="sell-item-price">{item.price}</p>
              <div className="sell-item-buttons">
                <button 
                  className="btn-primary"
                  onClick={() => handleSellClick(item)}
                >
                  Sell Similar Item
                </button>
                {/* <button className="btn-secondary">
                  View Details
                </button> */}
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