import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Sell.css';

const Sell = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [sellItems, setSellItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

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

  return (
    <div className={`sell-container ${isVisible ? 'animate-section' : ''}`} ref={sectionRef}>
      <h1 className="sell-title">
        Pre-Owned <span className="highlight">Gaming Gear</span>
      </h1>
      <p className="sell-subtitle">Check out the items available for sale below!</p>

      <button onClick={() => navigate('/sell-form')} className="sell-form-button">
        Sell an Item
      </button>

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
                {item.image ? (
                  <img src={item.image} alt={item.name} className="sell-item-image" />
                ) : (
                  <p style={{ textAlign: 'center' }}>No image available</p>
                )}
                <span className="condition-badge">{item.condition || 'Used'}</span>
              </div>
              <div className="sell-item-content">
                <h3 className="sell-item-name">{item.name}</h3>
                <p className="sell-item-description">{item.description || 'No description available'}</p>
                <p className="sell-item-price">₹{typeof item.price === 'number' ? item.price.toLocaleString() : item.price}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-items-message">
            <p>No items available for sale at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sell;