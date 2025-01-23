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

const Sell = ({ updateCartCount }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

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

  return (
    <div className={`sell-container ${isVisible ? 'animate-section' : ''}`} ref={sectionRef}>
      <h1 className="sell-title">
        Pre-Owned <span className="highlight">Gaming Gear</span>
      </h1>
      <p className="sell-subtitle">Quality checked and verified gaming consoles at the best prices!</p>
      
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
                  onClick={() => updateCartCount(item)}
                >
                  Add To Cart
                </button>
                <button className="btn-secondary">
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

export default Sell;