import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCreditCard, FaWallet, FaCheckCircle, FaSpinner, FaGooglePay } from 'react-icons/fa';
import './Payment.css';

const Payment = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [orderDetails, setOrderDetails] = useState(null);

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
    }
  }, [cartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success state
      setShowSuccess(true);
      
      // Clear cart and session storage
      clearCart();
      sessionStorage.removeItem('checkoutFormData');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGPayClick = () => {
    // Calculate total amount
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
    const shipping = 100; // Fixed shipping cost
    const tax = subtotal * 0.18; // 18% tax
    const totalAmount = subtotal + shipping + tax;

    // Navigate to GPay with required data
    navigate('/gpay', {
      state: {
        amount: totalAmount,
        orderDetails: formData,
        cartItems: cartItems
      }
    });
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

      <div className="payment-methods">
        <h3>Select Payment Method</h3>
        {/* <div 
          className={`payment-method ${selectedMethod === 'card' ? 'selected' : ''}`}
          onClick={() => setSelectedMethod('card')}
        >
          <FaCreditCard />
          <span>Credit/Debit Card</span>
        </div> */}
        <div 
          className={`payment-method ${selectedMethod === 'gpay' ? 'selected' : ''}`}
          onClick={() => setSelectedMethod('gpay')}
        >
          <FaGooglePay />
          <span>Google Pay</span>
        </div>
        {/* <div 
          className={`payment-method ${selectedMethod === 'wallet' ? 'selected' : ''}`}
          onClick={() => setSelectedMethod('wallet')}
        >
          <FaWallet />
          <span>Wallet</span>
        </div> */}
      </div>

      {selectedMethod === 'card' && (
        <form onSubmit={handleSubmit} className="card-details">
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
              maxLength="19"
            />
          </div>
          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              name="cardName"
              placeholder="John Doe"
              value={formData.cardName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleInputChange}
                required
                maxLength="5"
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="password"
                name="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
                required
                maxLength="3"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className={`pay-now-btn ${isProcessing ? 'loading' : ''}`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <FaSpinner className="spinner" />
                Processing...
              </>
            ) : (
              `Pay ₹${orderDetails.totalAmount.toLocaleString()}`
            )}
          </button>
        </form>
      )}

      {selectedMethod === 'gpay' && (
        <div className="gpay-section">
          <button 
            onClick={handleGPayClick}
            className="gpay-button"
          >
            <FaGooglePay />
            Pay with Google Pay
          </button>
          <p className="gpay-note">You will be redirected to Google Pay to complete your payment</p>
        </div>
      )}
    </div>
  );
};

export default Payment; 