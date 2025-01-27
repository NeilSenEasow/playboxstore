import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rent.css';

const Rent = ({ updateCartCount }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const [rentItems, setRentItems] = useState([]);

  useEffect(() => {
    const fetchRentItems = async () => {
      try {
        const apiUrl = import.meta.env.VITE_PROD_BASE_URL + '/api/products' || import.meta.env.VITE_API_URL + '/api/products'; // Use environment variables
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRentItems(data.rentItems); // Assuming the data structure is an array of rent items
      } catch (error) {
        console.error('Error fetching rent items:', error);
      }

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
    };

    fetchRentItems();
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
        {rentItems.map((item, index) => (
          <div 
            key={item.id} 
            className="rent-item"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="rent-item-image-container">
              <img src={item.image} alt={item.name} className="rent-item-image" />
            </div>
            <div className="rent-item-content">
              <h3 className="rent-item-name">{item.name}</h3>
              <p className="rent-item-description">{item.description || 'Available for Rent'}</p>
              <p className="rent-item-price">₹{item.rentPrice.toLocaleString()}/day</p>
              <div className="rent-item-buttons">
                <button 
                  className="btn-primary"
                  onClick={() => updateCartCount(item)}
                >
                  Book Now
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => handleViewDetails(item.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rent;