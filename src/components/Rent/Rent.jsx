import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rent.css';

import PS5Image from '../../assets/games/Game1.png';
import XboxImage from '../../assets/games/Game2.png';
import SwitchImage from '../../assets/games/Game3.png';

export const rentItems = [
  { 
    id: 1, 
    name: 'PlayStation 5', 
    price: '₹499/day',
    description: '40+ Games Available',
    image: PS5Image 
  },
  { 
    id: 2, 
    name: 'Xbox Series X', 
    price: '₹499/day',
    description: 'With Game Pass | Unlimited Games',
    image: XboxImage 
  },
  { 
    id: 3, 
    name: 'Nintendo Switch', 
    price: '₹399/day',
    description: '25+ Games Available',
    image: SwitchImage 
  },
];

const Rent = ({ updateCartCount }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

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
              <p className="rent-item-description">{item.description}</p>
              <p className="rent-item-price">{item.price}</p>
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