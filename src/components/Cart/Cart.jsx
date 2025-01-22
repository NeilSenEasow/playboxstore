import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCart4 } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';  // Trash icon
import './Cart.css';

const Cart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  // Function to delete a specific item
  const handleDeleteItem = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this item from the cart?');
    if (confirmDelete) {
      const updatedCartItems = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCartItems);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">
          <BsCart4 size={30} style={{ marginRight: '10px' }} /> Your Cart
        </h2>
      </div>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">{item.price}</p>
                </div>
                <button 
                  className="delete-item-button"
                  onClick={() => handleDeleteItem(index)}
                  title="Remove item"
                >
                  <FaTrashAlt size={18} color="#ff4747" />
                </button>
              </li>
            ))}
          </ul>
          <button className="checkout-button" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
