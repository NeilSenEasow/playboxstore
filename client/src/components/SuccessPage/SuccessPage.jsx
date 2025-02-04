import React, { useEffect } from 'react';
import './SuccessPage.css';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [navigate]);

  return (
    <div className="success-page">
      <div className="success-content">
        <FaCheckCircle className="success-icon" />
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase.</p>
        <p>Your order will be processed shortly.</p>
        <p className="redirect-message">Redirecting to the home page...</p>
      </div>
    </div>
  );
};

export default SuccessPage;
