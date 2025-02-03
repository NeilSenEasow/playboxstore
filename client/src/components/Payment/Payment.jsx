import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMoneyBill, FaWallet } from 'react-icons/fa';
import './Payment.css';

const Payment = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Get checkout form data from session storage
    const savedFormData = sessionStorage.getItem('checkoutFormData');
    if (!savedFormData) {
      navigate('/checkout');
      return;
    }
    setFormData(JSON.parse(savedFormData));

    // Calculate total from cart items
    const cartTotal = cartItems?.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return sum + price;
    }, 0) || 0;
    setTotal(cartTotal);
  }, [navigate, cartItems]);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <FaCreditCard size={24} />,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <FaMoneyBill size={24} />,
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <FaWallet size={24} />,
    },
  ];

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: total,
          paymentMethod: selectedMethod,
          orderDetails: formData
        })
      });
      
      // Clear cart and session storage
      clearCart();
      sessionStorage.removeItem('checkoutFormData');
      
      // Show success message and redirect
      alert('Payment successful! Thank you for your order.');
      navigate('/');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!formData || !cartItems?.length) {
    return <div className="payment-container">Loading...</div>;
  }

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary-details">
          <p>Items: {cartItems.length}</p>
          <p>Shipping Address: {`${formData.address}, ${formData.city}`}</p>
          <p className="total-amount">Total Amount: ₹{total.toLocaleString()}</p>
        </div>
      </div>

      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          {paymentMethods.map(method => (
            <div 
              key={method.id}
              className={`payment-method ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => setSelectedMethod(method.id)}
            >
              {method.icon}
              <span>{method.name}</span>
            </div>
          ))}
        </div>

        {selectedMethod === 'card' && (
          <div className="card-details">
            <div className="form-group">
              <label>Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456" 
                maxLength="16"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input 
                  type="password" 
                  placeholder="***" 
                  maxLength="3"
                  required
                />
              </div>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className={`pay-now-btn ${loading ? 'loading' : ''}`}
          disabled={loading || !selectedMethod}
        >
          {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
        </button>
      </form>
    </div>
  );
};

export default Payment; 