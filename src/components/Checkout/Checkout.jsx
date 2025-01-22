import React from "react";
import "./Checkout.css"
import { FaHome } from 'react-icons/fa';

function Checkout() {
  return (
    <div className="checkout-container">
      <div className="address-header">
        <FaHome size={24} color="#ff4747" />
        <h2>Add address</h2>
      </div>

      <form className="checkout-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="+91 9999 9999"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Address"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="street">Street Name</label>
            <input
              type="text"
              id="street"
              placeholder="Street Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              placeholder="City"
            />
          </div>
          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              type="text"
              id="district"
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
              placeholder="STATE"
            />
          </div>
          <div className="form-group">
            <label htmlFor="zipcode">Zip code</label>
            <input
              type="text"
              id="zipcode"
              placeholder="Zip Code"
            />
          </div>
          <div className="form-group">
            <label htmlFor="landmark">Landmark</label>
            <input
              type="text"
              id="landmark"
              placeholder="Landmark"
            />
          </div>
        </div>

        <button type="submit" className="confirm-order-btn">
          Confirm Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;