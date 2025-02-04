import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css"
import { FaHome, FaCheckCircle } from 'react-icons/fa';

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
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin', { state: { from: '/checkout' } });
    }
  }, [navigate]);

  // Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  // Calculate order total
  useEffect(() => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
    const shipping = 100;
    const tax = subtotal * 0.18;
    setOrderTotal(subtotal + shipping + tax);
  }, [cartItems]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipcode) newErrors.zipcode = 'Zipcode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    setError(null); // Clear any previous errors
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin', { state: { from: '/checkout' } });
        return;
      }

      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setShowSuccess(true);
      
      // Clear cart after 3 seconds and redirect
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message || 'An error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="checkout-success">
        <div className="success-content">
          <FaCheckCircle className="success-icon" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase.</p>
          <div className="order-details">
            <p>Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            <p>Amount Paid: ₹{orderTotal.toLocaleString()}</p>
          </div>
          <p className="redirect-message">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  if (!cartItems?.length) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-message">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="address-header">
        <FaHome size={24} color="#ff4747" />
        <h2>Add address</h2>
      </div>

      {error && (
        <div className="error-message global-error">
          {error}
        </div>
      )}

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
          className={`submit-button ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;