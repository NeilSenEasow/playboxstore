import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">PLAY</span>
        <span className="logo-accent">BOX</span>
      </div>
      <ul className="navbar-menu">
        <li>Home</li>
        <li>Sell</li>
        <li>Buy <span className="dropdown-arrow">▼</span></li>
        <li>Rent</li>
      </ul>
      <div className="navbar-actions">
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="notifications">
        <span className="notification-icon">
          🛒
        </span>
          <span className="notification-badge">0</span>
        </div>
        <button className="sign-in-btn">Sign In</button>
      </div>
    </nav>
  );
};

export default Navbar;
