import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rentItems } from '../Rent/Rent';
import './RentDetails.css';

const RentDetails = ({ updateCartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const item = rentItems.find(item => item.id.toString() === id);

  if (!item) {
    return (
      <div className="rent-details-container">
        <h2>Product not found</h2>
        <button className="btn-secondary" onClick={() => navigate('/rent')}>
          Back to Rent
        </button>
      </div>
    );
  }

  return (
    <div className="rent-details-container">
      <button className="back-button" onClick={() => navigate('/rent')}>
        ← Back to Rent
      </button>
      
      <div className="rent-details-content">
        <div className="rent-details-left">
          <div className="rent-details-image-container">
            <img src={item.image} alt={item.name} className="rent-details-image" />
          </div>
          <div className="rent-details-thumbnails">
            {/* Additional product images could go here */}
          </div>
        </div>

        <div className="rent-details-right">
          <h1>{item.name}</h1>
          <p className="rent-details-price">{item.price}</p>
          <p className="rent-details-description">{item.description}</p>

          <div className="rent-details-specs">
            <h3>Rental Terms</h3>
            <ul>
              <li>Minimum Period: 1 Day</li>
              <li>Security Deposit: ₹5,000</li>
              <li>ID Proof Required</li>
              <li>Free Delivery & Pickup</li>
            </ul>
          </div>

          <div className="rent-details-features">
            <h3>What's Included</h3>
            <ul>
              <li>Console with all cables</li>
              <li>2 Controllers</li>
              <li>3 Games of your choice</li>
              <li>Carrying Case</li>
            </ul>
          </div>

          <div className="rent-details-buttons">
            <button 
              className="btn-primary"
              onClick={() => {
                updateCartCount(item);
                navigate('/cart');
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentDetails; 