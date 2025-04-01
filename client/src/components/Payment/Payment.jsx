import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './Payment.css';
//Updating payment
const Payment = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const checkoutData = sessionStorage.getItem('checkoutFormData');
    if (checkoutData) {
      const parsedData = JSON.parse(checkoutData);
      
      // Calculate cart total
      const subtotal = cartItems.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
      }, 0);

      const shipping = 100; // Fixed shipping cost
      const tax = subtotal * 0.18; // 18% tax
      const totalAmount = subtotal + shipping + tax;

      setOrderDetails({
        ...parsedData,
        subtotal,
        shipping,
        tax,
        totalAmount,
        items: cartItems
      });

      // Set form data from checkout
      setFormData(parsedData);
    }
  }, [cartItems]);

  const handlePayPalClick = () => {
    // Redirect to PayPal authentication
    window.location.href = `${import.meta.env.VITE_PROD_BASE_URL}/auth/paypal`;
  };

  if (showSuccess) {
    return (
      <div className="payment-success">
        <div className="success-content">
          <FaCheckCircle className="success-icon" />
          <h2>Payment Successful!</h2>
          <p>Your order has been confirmed.</p>
          <p>Redirecting to home page...</p>
          <div className="order-confirmation">
            <p>Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            <p>Amount Paid: ₹{orderDetails?.totalAmount?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails || !cartItems?.length) {
    return <div className="payment-container">Loading...</div>;
  }

  return (
    <div className="payment-container">
      <h2>Complete Your Payment</h2>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity || 1}</p>
                <p>₹{item.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="summary-details">
          <p>Subtotal: <span>₹{orderDetails.subtotal.toLocaleString()}</span></p>
          <p>Shipping: <span>₹{orderDetails.shipping.toLocaleString()}</span></p>
          <p>Tax (18%): <span>₹{orderDetails.tax.toLocaleString()}</span></p>
          <p className="total-amount">Total: <span>₹{orderDetails.totalAmount.toLocaleString()}</span></p>
        </div>
      </div>

      <div className="user-details">
        <h3>User Details</h3>
        <p>Name: {formData.firstName} {formData.lastName}</p>
        <p>Email: {formData.email}</p>
        <p>Phone: {formData.phone}</p>
        <p>Address: {formData.address}, {formData.street}, {formData.city}, {formData.district}, {formData.state}, {formData.zipcode}</p>
      </div>

      <div className="payment-methods">
        <h3>Select Payment Method</h3>
        <div 
          className={`payment-method`}
          onClick={handlePayPalClick}
        >
          <span>PayPal</span>
        </div>
      </div>
    </div>
  );
};

export default Payment; 