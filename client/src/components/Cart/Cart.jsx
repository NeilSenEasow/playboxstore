import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCart4 } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';  // Trash icon
import './Cart.css';

const Cart = ({ cartItems, setCartItems, removeFromCart, clearCart }) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isClearingCart, setIsClearingCart] = useState(false);

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price;
    }
    // If price is a string like "₹1,999.00", convert to number
    const numericPrice = price?.replace(/[^\d]/g, '');
    return numericPrice ? parseInt(numericPrice) : 0;
  };

  const calculateTotal = (items) => {
    if (!items || !items.length) return 0;
    
    return items.reduce((total, item) => {
      const itemPrice = item.rentPrice || item.price || 0; // Handle both regular and rental prices
      const quantity = item.quantity || 1; // Default to 1 if quantity is undefined
      return total + (formatPrice(itemPrice) * quantity); 
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    window.scrollTo(0, 0); // Scroll to top before navigating
    navigate('/checkout'); // Navigate to checkout
  };

  const handleDeleteItem = (itemId) => {
    setItemToDelete(cartItems.find(item => item.id === itemId));
    setShowConfirmDialog(true);
  };

  const handleClearCart = () => {
    setIsClearingCart(true);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (isClearingCart) {
      clearCart();
      setIsClearingCart(false);
    } else if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      setItemToDelete(null);
    }
    setShowConfirmDialog(false);
  };

  const handleQuantityChange = (itemId, change) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, (item.quantity || 0) + change) } 
          : item
      )
    );
  };

  const addToCart = (newItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      if (existingItem) {
        // If the item already exists, update its quantity
        return prevItems.map(item => 
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + newItem.quantity } 
            : item
        );
      } else {
        // If it doesn't exist, add it to the cart
        return [...prevItems, newItem];
      }
    });
  };

  const groupedItems = cartItems.reduce((acc, item) => {
    const existingItem = acc.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity || 0; // Ensure quantity is a number
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  return (
    <div className="cart-container">
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>
              {isClearingCart 
                ? 'Are you sure you want to clear all items from your cart?' 
                : `Are you sure you want to remove "${itemToDelete?.name}" from your cart?`}
            </p>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleConfirmDelete}>Yes, Delete</button>
              <button className="btn-secondary" onClick={() => {
                setShowConfirmDialog(false);
                setItemToDelete(null);
                setIsClearingCart(false);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

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
      {groupedItems.length === 0 ? (
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
            {groupedItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={`${import.meta.env.VITE_PROD_BASE_URL}${item.image}`} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">
                    ₹{formatPrice(item.rentPrice || item.price).toLocaleString()}
                    {item.rentPrice ? '/day' : ''}
                  </p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span>{item.quantity || 1}</span> {/* Default to 1 if quantity is undefined */}
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
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
              <span>₹{calculateTotal(groupedItems).toLocaleString()}</span>
            </div>
            <div className="cart-buttons">
              <button 
                className="checkout-button"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              {/* <button 
                className="btn-secondary"
                onClick={handleClearCart}
              >
                Clear Cart
              </button> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
