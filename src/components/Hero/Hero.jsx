// import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <main className="hero-main">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="block">Discover Your Next</span>
              <span className="block hero-highlight">Gaming Adventure</span>
            </h1>
            <p className="hero-description">
              Buy, Sell, or Rent the Latest Games. Your one-stop shop for all things gaming - from classic titles to cutting-edge releases.
            </p>
            <div className="hero-buttons">
              <Link to="/buy" className="hero-button primary">
                Start Browsing
              </Link>
              <Link to="/sell" className="hero-button secondary">
                Sell Your Games
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Hero;
