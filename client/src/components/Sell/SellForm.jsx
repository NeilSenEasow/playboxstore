import React, { useEffect, useRef, useState } from 'react';
import './SellForm.css';

const SellForm = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    condition: '',
    description: '',
    price: '',
    contactNumber: '',
    image: ''
  });
  const [shippingAddress, setShippingAddress] = useState({
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
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUserId(userData._id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNewItemSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const sellData = {
        userId: userId || "guest-user", // Use fetched user ID or fallback
        quantity: 1,
        status: 'Pending',
        shippingAddress: shippingAddress,
        ...newItem
      };

      const response = await fetch('http://localhost:5000/api/sell-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit item');
      }

      const result = await response.json();
      console.log('New item submitted:', result);
      
      // Reset the form and show success message
      setNewItem({
        name: '',
        category: '',
        condition: '',
        description: '',
        price: '',
        contactNumber: '',
        image: ''
      });
      setShippingAddress({
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
      setSubmitStatus({ success: true, error: null });
    } catch (error) {
      console.error('Error submitting new item:', error);
      setSubmitStatus({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`sell-container ${isVisible ? 'animate-section' : ''}`} ref={sectionRef}>
      <h1 className="sell-title">
        Pre-Owned <span className="highlight">Gaming Gear</span>
      </h1>
      <p className="sell-subtitle">Want to sell your gaming gear? Fill out the form below!</p>

      {/* New Item Form */}
      <form onSubmit={handleNewItemSubmit} className="new-item-form">
        <h2>Sell Your Item</h2>
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleNewItemChange}
            placeholder="Enter item name"
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={newItem.category} onChange={handleNewItemChange} required>
            <option value="">Select Category</option>
            <option value="Consoles">Consoles</option>
            <option value="Games">Games</option>
          </select>
        </div>
        <div className="form-group">
          <label>Item Condition</label>
          <select name="condition" value={newItem.condition} onChange={handleNewItemChange} required>
            <option value="">Select Condition</option>
            <option value="like-new">Like New</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="description"
            value={newItem.description}
            onChange={handleNewItemChange}
            placeholder="Describe your item's condition, included accessories, etc."
            required
          />
        </div>
        <div className="form-group">
          <label>Your Price (₹)</label>
          <input 
            type="number" 
            name="price"
            value={newItem.price}
            onChange={handleNewItemChange}
            placeholder="Enter your asking price"
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input 
            type="tel" 
            name="contactNumber"
            value={newItem.contactNumber}
            onChange={handleNewItemChange}
            placeholder="Enter your contact number"
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input 
            type="url" 
            name="image"
            value={newItem.image}
            onChange={handleNewItemChange}
            placeholder="Enter image URL"
          />
        </div>
        
        <h3>Shipping Information</h3>
        <div className="form-group">
          <label>First Name</label>
          <input 
            type="text" 
            name="firstName"
            value={shippingAddress.firstName}
            onChange={handleShippingAddressChange}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input 
            type="text" 
            name="lastName"
            value={shippingAddress.lastName}
            onChange={handleShippingAddressChange}
            placeholder="Enter your last name"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email"
            value={shippingAddress.email}
            onChange={handleShippingAddressChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input 
            type="tel" 
            name="phone"
            value={shippingAddress.phone}
            onChange={handleShippingAddressChange}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input 
            type="text" 
            name="address"
            value={shippingAddress.address}
            onChange={handleShippingAddressChange}
            placeholder="Enter your address"
            required
          />
        </div>
        <div className="form-group">
          <label>Street</label>
          <input 
            type="text" 
            name="street"
            value={shippingAddress.street}
            onChange={handleShippingAddressChange}
            placeholder="Enter your street"
            required
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input 
            type="text" 
            name="city"
            value={shippingAddress.city}
            onChange={handleShippingAddressChange}
            placeholder="Enter your city"
            required
          />
        </div>
        <div className="form-group">
          <label>District</label>
          <input 
            type="text" 
            name="district"
            value={shippingAddress.district}
            onChange={handleShippingAddressChange}
            placeholder="Enter your district"
            required
          />
        </div>
        <div className="form-group">
          <label>State</label>
          <input 
            type="text" 
            name="state"
            value={shippingAddress.state}
            onChange={handleShippingAddressChange}
            placeholder="Enter your state"
            required
          />
        </div>
        <div className="form-group">
          <label>Zipcode</label>
          <input 
            type="text" 
            name="zipcode"
            value={shippingAddress.zipcode}
            onChange={handleShippingAddressChange}
            placeholder="Enter your zipcode"
            required
          />
        </div>
        <div className="form-group">
          <label>Landmark (Optional)</label>
          <input 
            type="text" 
            name="landmark"
            value={shippingAddress.landmark}
            onChange={handleShippingAddressChange}
            placeholder="Enter a landmark"
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Status Messages */}
      {submitStatus.success && (
        <div className="success-message">
          Item submitted successfully! Our team will review it shortly.
        </div>
      )}
      {submitStatus.error && (
        <div className="error-message">
          Error: {submitStatus.error}
        </div>
      )}
    </div>
  );
};

export default SellForm;