import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css"
import { FaHome } from 'react-icons/fa';

function Checkout({ cartItems, clearCart }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    street: '',
    city: '',
    district: '',
    state: '',
    zipcode: '',
    landmark: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data here if needed
      
      // Navigate to GPay page instead of directly processing the order
      navigate('/gpay', { 
        state: { 
          amount: cartItems.reduce((total, item) => total + item.price, 0),
          orderDetails: formData
        } 
      });
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="address-header">
        <FaHome size={24} color="#ff4747" />
        <h2>Add address</h2>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9999 9999"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="street">Street Name</label>
            <input
              type="text"
              id="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Street Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              type="text"
              id="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="District"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="STATE"
            />
          </div>
          <div className="form-group">
            <label htmlFor="zipcode">Zip code</label>
            <input
              type="text"
              id="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              placeholder="Zip Code"
            />
          </div>
          <div className="form-group">
            <label htmlFor="landmark">Landmark</label>
            <input
              type="text"
              id="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Landmark"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className={`confirm-order-btn ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Order'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;