import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCart4 } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';  // Trash icon
import './Cart.css';

const Cart = ({ cartItems, setCartItems, removeFromCart, clearCart }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return total + price;
    }, 0);
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
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">{item.price}</p>
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
            <p className="cart-total">Total: ₹{calculateTotal().toLocaleString()}</p>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
