import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RentDetails.css';

const RentDetails = ({ updateCartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from API
    fetch('http://localhost:5000/api')
      .then(response => response.json())
      .then(data => {
        // Find the specific item from rentItems array
        const rentItem = data.rentItems.find(item => item.id === parseInt(id));
        setItem(rentItem);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rent item details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!item) {
    return <div className="error">Item not found</div>;
  }

  return (
    <div className="rent-details">
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
            <p className="rent-details-price">₹{item.rentPrice.toLocaleString()}/day</p>
            <div className="rent-details-description">
              <h2>Description</h2>
              <p>{item.description || 'Available for Rent'}</p>
            </div>

            <div className="rent-details-specs">
              <h3>Specifications</h3>
              <ul>
                <li>Category: {item.category}</li>
                <li>Minimum Rental Period: 1 Day</li>
                <li>Security Deposit: ₹{(item.rentPrice * 10).toLocaleString()}</li>
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
    </div>
  );
};

export default RentDetails; 