import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { FaShippingFast } from 'react-icons/fa'; // Changed icon

// Removed unused cartItems prop unless needed for display, kept clearCart
function Checkout({ clearCart }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', street: '', city: '', district: '',
    state: '', zipcode: '', landmark: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null); // For general submission errors

  // Optional: Pre-fill form if user data is available (e.g., from context/localStorage)
  // useEffect(() => {
  //   const userData = getUserData(); // Replace with your logic to get logged-in user data
  //   if (userData) {
  //     setFormData(prev => ({
  //       ...prev,
  //       firstName: userData.firstName || '',
  //       lastName: userData.lastName || '',
  //       email: userData.email || '',
  //       phone: userData.phone || '',
  //       // Maybe prefill address parts if available
  //     }));
  //   }
  // }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    // Clear validation error on change
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
    // Clear general submission error when user types again
    if (submitError) {
        setSubmitError(null);
    }
  };

  // Basic Frontend Validation Logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
     // Basic Indian phone number check (adjust regex as needed)
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s+/g, ''))) newErrors.phone = 'Invalid phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipcode.trim()) newErrors.zipcode = 'Zip code is required';
    else if (!/^\d{6}$/.test(formData.zipcode)) newErrors.zipcode = 'Invalid zip code (must be 6 digits)';

    setErrors(newErrors);
    // Return true if errors object is empty
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null); // Clear previous submit errors

    // Validate form before submitting
    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return; // Stop submission
    }

    setIsSubmitting(true);

    try {
      // **IMPORTANT:** Store form data in session storage for the Payment page
      // This data persists only for the browser session.
      sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
      console.log('Checkout form data saved to sessionStorage.');

      // **CRITICAL FIX:** DO NOT CLEAR THE CART HERE!
      // The Payment page needs the cart items to display the order summary.
      // clearCart(); // <--- REMOVED THIS LINE

      // Navigate to the payment page
      console.log('Navigating to /payment...');
      navigate('/payment');

    } catch (error) {
      // Catch any unexpected errors during storage or navigation
      console.error('Checkout submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="address-header">
        <FaShippingFast size={24} color="#333" />
        <h2>Shipping Address</h2>
      </div>

      {/* Display general submission errors */}
      {submitError && <p className="error-message submit-error">{submitError}</p>}

      <form className="checkout-form" onSubmit={handleSubmit} noValidate> {/* Added noValidate to rely on custom validation */}
        {/* Form Rows and Groups */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" required className={errors.firstName ? 'error-border' : ''} />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" required className={errors.lastName ? 'error-border' : ''} />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email address *</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className={errors.email ? 'error-border' : ''} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input type="tel" id="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" required className={errors.phone ? 'error-border' : ''} />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address (Flat, House no., Building) *</label>
          <input type="text" id="address" value={formData.address} onChange={handleChange} placeholder="e.g., Flat No. 101, Building ABC" required className={errors.address ? 'error-border' : ''}/>
           {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-row">
           <div className="form-group">
            <label htmlFor="street">Area, Street, Sector, Village</label> {/* Optional field? */}
            <input type="text" id="street" value={formData.street} onChange={handleChange} placeholder="e.g., Sector 15" />
            {/* No error message shown if optional */}
          </div>
           <div className="form-group">
            <label htmlFor="landmark">Landmark</label> {/* Optional field? */}
            <input type="text" id="landmark" value={formData.landmark} onChange={handleChange} placeholder="e.g., Near City Hospital" />
             {/* No error message shown if optional */}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City / Town *</label>
            <input type="text" id="city" value={formData.city} onChange={handleChange} placeholder="Enter city" required className={errors.city ? 'error-border' : ''}/>
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>
           <div className="form-group">
            <label htmlFor="district">District</label> {/* Optional or required? */}
            <input type="text" id="district" value={formData.district} onChange={handleChange} placeholder="Enter district"/>
             {/* Add validation if required */}
          </div>

        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="state">State *</label>
            <input type="text" id="state" value={formData.state} onChange={handleChange} placeholder="Select state" required className={errors.state ? 'error-border' : ''}/>
            {/* Consider using a dropdown <select> for states */}
             {errors.state && <span className="error-message">{errors.state}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="zipcode">Zip code *</label>
            <input type="text" pattern="\d{6}" maxLength="6" id="zipcode" value={formData.zipcode} onChange={handleChange} placeholder="6-digit pincode" required className={errors.zipcode ? 'error-border' : ''} />
            {errors.zipcode && <span className="error-message">{errors.zipcode}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`confirm-order-btn btn-primary ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;