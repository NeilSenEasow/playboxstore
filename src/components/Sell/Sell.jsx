import React from 'react';
import './Sell.css';

import PS5Image from '../../assets/games/Game1.png';
import XboxImage from '../../assets/games/Game2.png';
import SwitchImage from '../../assets/games/Game3.png';

export const sellItems = [
  { id: 1, name: 'PlayStation 5', price: '₹49,999.00', image: PS5Image },
  { id: 2, name: 'Xbox Series X', price: '₹50,000.00', image: XboxImage },
  { id: 3, name: 'Nintendo Switch', price: '₹29,999.00', image: SwitchImage },
];

const Sell = ({ updateCartCount }) => {
  return (
    <div className="sell-container">
      <h1>Sell Page</h1>
      <div className="sell-items">
        {sellItems.map(item => (
          <div key={item.id} className="sell-item">
            <img src={item.image} alt={item.name} className="sell-item-image" />
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <div className="product-buttons">
              <button className="btn-primary">View More</button>
              <button className="btn-secondary" onClick={() => updateCartCount(item)}>Add To Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sell;