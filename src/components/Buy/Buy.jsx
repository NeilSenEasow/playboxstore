import React from 'react';
import './Buy.css';

import PS5Image from '../../assets/games/Game1.png';
import XboxImage from '../../assets/games/Game2.png';
import SwitchImage from '../../assets/games/Game3.png';

const buyItems = [
  { id: 1, name: 'PlayStation 5', price: '₹49,999.00', image: PS5Image },
  { id: 2, name: 'Xbox Series X', price: '₹50,000.00', image: XboxImage },
  { id: 3, name: 'Nintendo Switch', price: '₹29,999.00', image: SwitchImage },
];

const Buy = () => {
  return (
    <div className="buy-container">
      <h1>Buy Page</h1>
      <div className="buy-items">
        {buyItems.map(item => (
          <div key={item.id} className="buy-item">
            <img src={item.image} alt={item.name} className="buy-item-image" />
            <h3>{item.name}</h3>
            <p>{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buy; 