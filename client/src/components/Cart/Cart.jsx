import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCart4 } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';  // Trash icon
import './Cart.css';

const Cart = ({ cartItems, setCartItems, removeFromCart, clearCart }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price;
    }
    // If price is a string like "₹1,999.00", convert to number
    return parseInt(price.replace(/[^\d]/g, ''));
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const itemPrice = item.rentPrice || item.price; // Handle both regular and rental prices
      return total + formatPrice(itemPrice);
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  const handleDeleteItem = (itemId) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this item from the cart?');
    if (confirmDelete) {
      removeFromCart(itemId);
    }
  };

  const handleClearCart = () => {
    const confirmClear = window.confirm('Are you sure you want to clear your cart?');
    if (confirmClear) {
      clearCart();
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">
          <BsCart4 size={30} style={{ marginRight: '10px' }} /> Your Cart
        </h2>
        {cartItems.length > 0 && (
          <button className="clear-cart-button" onClick={handleClearCart}>
            Clear Cart
          </button>
        )}
      </div>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">
                    ₹{(item.rentPrice || item.price).toLocaleString()}
                    {item.rentPrice ? '/day' : ''}
                  </p>
                </div>
                <button 
                  className="delete-item-button"
                  onClick={() => handleDeleteItem(item.id)}
                  title="Remove item"
                >
                  <FaTrashAlt size={18} color="#ff4747" />
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{calculateTotal(cartItems).toLocaleString()}</span>
            </div>
            <div className="cart-buttons">
              <button 
                className="checkout-button"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              <button 
                className="btn-secondary"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
