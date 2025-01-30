import React, { useEffect, useRef, useState } from 'react';
import './Buy.css';

import PS5Image from '../../assets/games/Game1.png';
import XboxImage from '../../assets/games/Game2.png';
import SwitchImage from '../../assets/games/Game3.png';
import PS4Image from '../../assets/games/Game4.png';
import ControllerImage from '../../assets/console/console1.png';
import PS3Image from '../../assets/console/console2.png';

export const buyItems = [
  { 
    id: 'ps5-1', 
    name: 'PlayStation 5 Digital', 
    price: '₹44,999',
    condition: 'New',
    description: 'Digital Edition | 825GB SSD',
    image: PS5Image 
  },
  { 
    id: 'ps5-2', 
    name: 'PlayStation 5 Disc', 
    price: '₹54,999',
    condition: 'New',
    description: 'Disc Edition | 825GB SSD',
    image: PS5Image 
  },
  { 
    id: 'ps5-3', 
    name: 'DualSense Controller', 
    price: '₹5,999',
    condition: 'New',
    description: 'Wireless Controller | White',
    image: ControllerImage 
  },
  { 
    id: 'ps4-1', 
    name: 'PlayStation 4 Slim', 
    price: '₹29,999',
    condition: 'New',
    description: '1TB | Black | 1 Controller',
    image: PS4Image 
  },
  { 
    id: 'xbox-1', 
    name: 'Xbox Series X', 
    price: '₹49,999',
    condition: 'New',
    description: '1TB SSD | True 4K Gaming',
    image: XboxImage 
  },
  { 
    id: 'nintendo-1', 
    name: 'Nintendo Switch OLED', 
    price: '₹34,999',
    condition: 'New',
    description: '7-inch OLED Screen | Enhanced Audio',
    image: SwitchImage 
  }
];

const Buy = ({ updateCartCount }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.APP_URL}/api/products`);
        const data = await response.json();
        setProducts(data.products); // Assuming the API returns an object with a 'products' array
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

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

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const ItemDetails = ({ item, onClose }) => (
    <div className="details-overlay">
      <div className="details-modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="details-content">
          <div className="details-image-container">
            <img src={item.image} alt={item.name} className="details-image" />
            <span className="condition-badge">{item.condition}</span>
          </div>
          <div className="details-info">
            <h2>{item.name}</h2>
            <p className="details-price">₹{item.price.toLocaleString()}</p>
            <div className="details-description">
              <h3>Product Details</h3>
              <p>{item.description}</p>
              <div className="details-specs">
                <h3>Specifications</h3>
                <ul>
                  <li>Condition: {item.condition}</li>
                  <li>Warranty: 1 Year</li>
                  <li>Delivery: Free Shipping</li>
                  <li>Return Policy: 7 Days</li>
                </ul>
              </div>
            </div>
            <div className="details-buttons">
              <button 
                className="btn-primary"
                onClick={() => {
                  updateCartCount(item);
                  onClose();
                }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`buy-container ${isVisible ? 'animate-section' : ''}`} ref={sectionRef}>
      <h1 className="buy-title">
        New <span className="highlight">Gaming Gear</span>
      </h1>
      <p className="buy-subtitle">Latest gaming consoles and accessories at the best prices!</p>
      
      <div className="buy-items">
        {products.length > 0 ? (
          products.map((item, index) => (
            <div 
              key={item.id} 
              className="buy-item"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="buy-item-image-container">
                <img src={item.image} alt={item.name} className="buy-item-image" />
                <span className="condition-badge">{item.condition || 'New'}</span>
              </div>
              <div className="buy-item-content">
                <h3 className="buy-item-name">{item.name}</h3>
                <p className="buy-item-description">{item.description || `${item.category} - Brand New`}</p>
                <p className="buy-item-price">₹{item.price.toLocaleString()}</p>
                <div className="buy-item-buttons">
                  <button 
                    className="btn-primary"
                    onClick={() => updateCartCount(item)}
                  >
                    Add To Cart
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => handleViewDetails(item)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>

      {showDetails && selectedItem && (
        <ItemDetails 
          item={selectedItem} 
          onClose={() => {
            setShowDetails(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default Buy;