import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCart4 } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';  // Importing trash icon
import './Cart.css';

const Cart = ({ cartItems }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">
          <BsCart4 size={30} style={{ marginRight: '10px' }} /> Your Cart
        </h2>
        <button className="cart-icon-button" onClick={handleCartClick}>
          <BsCart4 size={30} />
          <span className="cart-count">{cartItems.length}</span>
        </button>
      </div>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">${item.price}</p>
              </div>
              <button className="remove-item-button">
                <FaTrashAlt size={20} color="red" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default Cart;
