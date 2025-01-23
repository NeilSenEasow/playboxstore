import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const handleWhatsAppClick = () => {
    // Format the phone number (remove any non-numeric characters)
    const phoneNumber = '8891064395'.replace(/\D/g, '');
    // Create the WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    // Open in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h1>PLAY <span className="highlight">BOX</span></h1>
          <p>
            exMart is the e-commerce website of Experion Global which holds all
            the Experion-branded items for sale.
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h3>PRODUCTS</h3>
            <ul>
              <li>PS5</li>
              <li>PS4</li>
              <li>PS3</li>
              <li>PS5 Games</li>
              <li>PS4 Games</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>YOUR ACCOUNT</h3>
            <ul>
              <li>Manage account</li>
              <li>Order History</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>CONTACT</h3>
            <ul>
              <li>📞 +91 99999 99999</li>
              <li>✉️ playbox@gmail.com</li>
              <li>📍 HR, Playbox, Gayathiri Building, Technopark phase-1, Trivandrum - 695581</li>
              <button 
                className="whatsapp-button"
                onClick={handleWhatsAppClick}
              >
                Chat with us on WhatsApp
              </button>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Terms and conditions | Shipping policy | Payment policy</p>
        <p>© 2024 HR Department Experion Global</p>
      </div>
    </footer>
  );
};

export default Footer;
