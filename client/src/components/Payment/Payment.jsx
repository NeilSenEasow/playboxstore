import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa'; // Added Spinner
import './Payment.css'; // Ensure this CSS file exists and is styled

// Receive cartItems and clearCart function from parent
const Payment = ({ cartItems = [], clearCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false); // For payment simulation
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null); // Holds combined order data
  const [formData, setFormData] = useState(null); // Holds just the user details from checkout
  const [error, setError] = useState(null); // For displaying errors

  useEffect(() => {
    console.log('--- Payment Component Mount/Update ---');
    console.log('Received cartItems:', cartItems);
    setError(null); // Reset error on re-run

    const checkoutDataString = sessionStorage.getItem('checkoutFormData');
    console.log('Raw checkoutData from sessionStorage:', checkoutDataString);

    // --- Validate Checkout Data ---
    if (!checkoutDataString) {
      console.error('Checkout form data not found in sessionStorage.');
      setError('Missing checkout details. Please complete the checkout form first.');
      // Consider navigating back automatically:
      // setTimeout(() => navigate('/checkout'), 3000);
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(checkoutDataString);
      console.log('Parsed checkoutData:', parsedData);
      setFormData(parsedData); // Set the form data state
    } catch (err) {
      console.error('Error parsing checkoutFormData from sessionStorage:', err);
      setError('There was an error retrieving your checkout details. Please try again.');
      return; // Stop if parsing failed
    }

    // --- Validate Cart Items ---
    if (!cartItems || cartItems.length === 0) {
        console.warn('Cart items are empty or not yet loaded.');
        // This shouldn't happen if Checkout.jsx is fixed, but handle defensively
        setError('Your cart is empty. Cannot proceed to payment.');
        // Consider navigating back:
        // setTimeout(() => navigate('/cart'), 3000);
        return;
    }

    // --- Calculate Totals ---
    try {
        const subtotal = cartItems.reduce((total, item) => {
            const price = Number(item.price) || 0; // Ensure price is a number
            const quantity = Number(item.quantity) || 1; // Default quantity to 1
            return total + (price * quantity);
        }, 0);

        const shipping = 100.00; // Use decimals for currency
        const taxRate = 0.0; // 18% tax
        const tax = subtotal * taxRate;
        const totalAmount = subtotal + shipping + tax;

        console.log('Calculated Totals:', { subtotal, shipping, tax, totalAmount });

        // Combine checkout data and calculated totals into orderDetails
        const newOrderDetails = {
            ...parsedData, // User details (firstName, lastName, address, etc.)
            items: [...cartItems], // Store a snapshot of the cart items
            subtotal,
            shipping,
            tax,
            totalAmount,
        };

        console.log('Setting Order Details:', newOrderDetails);
        setOrderDetails(newOrderDetails);

    } catch (calcError) {
        console.error("Error calculating totals:", calcError);
        setError("Could not calculate order total. Please check your cart items.");
        setOrderDetails(null); // Reset on error
    }

  // Dependency array: Re-run if cartItems changes (e.g., if cart could update in background, though unlikely here)
  // Or keep empty [] if cart should be static once on this page. Using [cartItems] is safer if cart state could technically change.
  }, [cartItems]);


  // --- Payment Success Handler ---
  const handlePaymentSuccess = () => {
    console.log('Payment successful! Clearing cart and session data.');
    clearCart(); // ** Call clearCart function passed via props **
    sessionStorage.removeItem('checkoutFormData'); // Clean up session storage
    setShowSuccess(true); // Show the success screen

    // Redirect to home or order confirmation page after a delay
    setTimeout(() => {
      console.log('Redirecting after success...');
      navigate('/'); // Navigate to the homepage
      // Or navigate('/order-confirmation', { state: { orderId: 'YOUR_REAL_ORDER_ID' } });
    }, 4000); // Redirect after 4 seconds
  };

  // --- Mock Payment Processing (Replace with actual SDK/API calls) ---
  const processMockPayment = (method) => {
     console.log(`Simulating ${method} payment processing...`);
     setIsProcessing(true);
     setError(null); // Clear previous errors

     // Simulate API call delay
     setTimeout(() => {
         // Simulate success/failure
         const isSuccess = Math.random() > 0.1; // 90% chance of success

         if (isSuccess) {
             console.log(`Mock ${method} payment approved!`);
             // On success, call the success handler
             handlePaymentSuccess();
         } else {
             console.error(`Mock ${method} payment failed.`);
             setError(`Payment failed via ${method}. Please try again or use another method.`);
         }
         setIsProcessing(false); // Stop processing indicator
     }, 2500); // Simulate 2.5 second delay
  };

  // --- PayPal Click Handler (Example using Mock) ---
  const handlePayPalClick = () => {
    if (isProcessing) return; // Prevent multiple clicks
    processMockPayment('PayPal');

    // ** Real PayPal Integration would go here **
    // Option 1: Redirect to backend for PayPal flow
    // window.location.href = `${import.meta.env.VITE_API_URL}/auth/paypal?orderId=...`;
    // Option 2: Use PayPal JS SDK (@paypal/react-paypal-js)
    // This would involve creating an order on your backend first, getting an order ID,
    // then using the SDK's buttons to handle the PayPal popup/redirect and capture payment.
  };

  // --- Render Logic ---

  // 1. Show Error State
  if (error) {
    return (
      <div className="payment-container error-message">
        <h2>Payment Error</h2>
        <p>{error}</p>
        <button className="btn-secondary" onClick={() => navigate('/checkout')}>Go Back to Checkout</button>
        <button className="btn-secondary" onClick={() => navigate('/cart')}>View Cart</button>
      </div>
    );
  }

  // 2. Show Success Screen
  if (showSuccess) {
    // Generate a temporary pseudo-random ID for display if needed
    const displayOrderId = Math.random().toString(36).substring(2, 11).toUpperCase();
    return (
      <div className="payment-success">
        <div className="success-content">
          <FaCheckCircle className="success-icon" />
          <h2>Payment Successful!</h2>
          <p>Your order has been confirmed and is being processed.</p>
          <div className="order-confirmation">
            {/* Use a real Order ID from backend if available */}
            <p>Order Confirmation: #{orderDetails?.orderId || displayOrderId}</p>
            <p>Amount Paid: ₹{orderDetails?.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <p>You will be redirected shortly...</p>
          <FaSpinner className="loading-spinner" /> {/* Simple spinner */}
        </div>
      </div>
    );
  }

  // 3. Show Loading State (Only if orderDetails or formData hasn't loaded AND no error)
  if (!orderDetails || !formData) {
    console.log('Render: Waiting for order details or form data...');
    return (
        <div className="payment-container loading-container">
            <FaSpinner className="loading-spinner large" />
            <p>Loading payment details...</p>
        </div>
    );
  }

  // 4. Show Main Payment Page Content
  // We now know: no error, not success yet, orderDetails & formData are loaded.
  return (
    <div className="payment-container">
      <h2>Complete Your Payment</h2>

      {/* Order Summary Section */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="cart-items-summary"> {/* Use a different class if needed */}
          {orderDetails.items.map((item, index) => (
             // Use a stable key like item._id or item.id if available
            <div key={item._id || item.id || index} className="summary-cart-item">
              {/* <img src={`${import.meta.env.VITE_API_URL}${item.image}`} alt={item.name || 'Item'} className="summary-item-image"/> */}
              <div className="summary-item-details">
                <h4>{item.name || 'Unnamed Item'} (x{item.quantity || 1})</h4>
                <p>₹{(Number(item.price) || 0).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="summary-details">
          <p>Subtotal: <span>₹{orderDetails.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p>Shipping: <span>₹{orderDetails.shipping.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p>Tax ({Math.round(orderDetails.tax / orderDetails.subtotal * 100 || 0)}%): <span>₹{orderDetails.tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <hr/>
          <p className="total-amount">Total Amount: <span>₹{orderDetails.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
        </div>
      </div>

      {/* User Details Section */}
      <div className="user-details-summary">
        <h3>Shipping To</h3>
        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        <p><strong>Address:</strong> {`${formData.address}, ${formData.street ? formData.street + ', ' : ''}${formData.city}, ${formData.district ? formData.district + ', ' : ''}${formData.state} - ${formData.zipcode}`}</p>
        {formData.landmark && <p><strong>Landmark:</strong> {formData.landmark}</p>}
      </div>

      {/* Payment Methods Section */}
      <div className="payment-methods">
        <h3>Select Payment Method</h3>
        {/* Example: PayPal Button */}
        <div
          className={`payment-method paypal ${isProcessing ? 'processing' : ''}`}
          onClick={handlePayPalClick}
          role="button" // Improve accessibility
          tabIndex={isProcessing ? -1 : 0} // Manage focus
        >
          {/* Replace with actual PayPal logo/button component if using SDK */}
           {/* <img src="/path/to/paypal-logo.png" alt="PayPal" /> */}
          <span>
            {isProcessing ? (
              <><FaSpinner className="button-spinner" /> Processing...</>
            ) : (
              'Pay with PayPal'
            )}
          </span>
        </div>

        {/* Add other payment methods here (e.g., Stripe, Credit Card Form) */}
        {/* Example Placeholder */}
        <div className="payment-method disabled">
            <span>Credit/Debit Card (Coming Soon)</span>
        </div>

      </div>
    </div>
  );
};

export default Payment;