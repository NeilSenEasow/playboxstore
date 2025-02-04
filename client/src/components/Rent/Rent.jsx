import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rent.css';

const Rent = ({ updateCartCount }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const [rentItems, setRentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRentItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Filter items that are available for rent
        const rentableItems = data.filter(item => 
          item.rentPrice && 
          item.category === 'Consoles' && 
          item.availableQuantity > 0
        );
        setRentItems(rentableItems);
      } catch (error) {
        console.error('Error fetching rent items:', error);
        setRentItems([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentItems();

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

  const handleViewDetails = (id) => {
    navigate(`/rent/${id}`);
  };

  return (
    <div className={`rent-container ${isVisible ? 'animate-section' : ''}`} ref={sectionRef}>
      <h1 className="rent-title">
        Rent Your Favorite <span className="highlight">Console</span>
      </h1>
      <p className="rent-subtitle">Experience gaming without commitment - Rent today, play today!</p>
      
      <div className="rent-items">
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : rentItems.length > 0 ? (
          rentItems.map((item, index) => (
            <div 
              key={item._id || index} 
              className="rent-item"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="rent-item-image-container">
                <img src={item.image} alt={item.name} className="rent-item-image" />
              </div>
              <div className="rent-item-content">
                <h3 className="rent-item-name">{item.name}</h3>
                <p className="rent-item-description">{item.description || 'Available for Rent'}</p>
                <p className="rent-item-price">₹{(item.price * 0.1).toLocaleString()}/day</p>
                <div className="rent-item-buttons">
                  <button 
                    className="btn-primary"
                    onClick={() => updateCartCount({...item, rentPrice: item.price * 0.1})}
                  >
                    Book Now
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => handleViewDetails(item._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-items-message">
            <p>No items available for rent at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rent;