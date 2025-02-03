import React, { useState, useEffect } from "react";
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
  const [products, setProducts] = useState([]);

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
      }
    };
    fetchProducts();
  }, []);

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
      // Get user token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Fetch user data
      const userResponse = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      const userId = userData._id;

      // Create order
      const orderResponse = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            id: item.id || item._id,
            quantity: item.quantity || 1
          })),
          userId: userId,
          orderDetails: formData
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      // Store form data in session storage for payment page
      sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
      
      // Clear cart and redirect to payment
      clearCart();
      navigate('/payment');
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message);
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