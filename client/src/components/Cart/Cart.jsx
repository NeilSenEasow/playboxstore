import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCart4 } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import './Cart.css';

// Assuming cartItems already has aggregated quantities if items were added multiple times
const Cart = ({ cartItems = [], setCartItems, removeFromCart, clearCart }) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // Store the whole item or just ID
  const [isClearingCart, setIsClearingCart] = useState(false); // Flag for clear cart confirmation

  // Helper to safely get price (handles potential rentPrice and ensures number)
  const getItemPrice = (item) => {
    const price = item?.rentPrice ?? item?.price ?? 0; // Use ?? nullish coalescing
    // Remove currency symbols and commas if necessary, then convert to number
    if (typeof price === 'string') {
        const numericString = price.replace(/[^0-9.]/g, ''); // Keep only numbers and decimal point
        return parseFloat(numericString) || 0;
    }
    return Number(price) || 0; // Ensure it's a number
  };

  // Calculate total based on current cartItems
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const price = getItemPrice(item);
      const quantity = Number(item.quantity) || 1; // Default quantity to 1 if invalid/missing
      return total + (price * quantity);
    }, 0);
  };

  const handleQuantityChange = (itemId, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          // Ensure quantity doesn't go below 1
          ? { ...item, quantity: Math.max(1, (Number(item.quantity) || 0) + change) }
          : item
      ).filter(item => item.quantity > 0) // Optionally remove if quantity becomes 0 (though handled by Math.max(1,...))
    );
  };

  // --- Deletion Logic ---
  const initiateDeleteItem = (itemId) => {
    // Find the item name for the confirmation message
    const item = cartItems.find(item => item.id === itemId);
    setItemToDelete(item); // Store the item (or just its ID and name)
    setIsClearingCart(false); // Ensure we know it's single item deletion
    setShowConfirmDialog(true);
  };

  const initiateClearCart = () => {
    if (cartItems.length === 0) return; // Don't show dialog if cart is empty
    setIsClearingCart(true);
    setItemToDelete(null); // No specific item being deleted
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (isClearingCart) {
      clearCart(); // Call clearCart passed from parent
    } else if (itemToDelete) {
      removeFromCart(itemToDelete.id); // Call removeFromCart passed from parent
    }
    closeConfirmDialog();
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setItemToDelete(null);
    setIsClearingCart(false);
  };

  // --- Navigation ---
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty! Please add items before proceeding.');
      return;
    }
    window.scrollTo(0, 0); // Scroll to top for better UX
    navigate('/checkout'); // Navigate to checkout page
  };

  const totalAmount = calculateTotal(cartItems);

  return (
    <div className="cart-container">
      {/* Confirmation Dialog Modal */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Action</h3>
            <p>
              {isClearingCart
                ? 'Are you sure you want to remove all items from your cart?'
                : `Are you sure you want to remove "${itemToDelete?.name || 'this item'}" from your cart?`}
            </p>
            <div className="modal-buttons">
              <button className="btn-primary confirm-delete-btn" onClick={handleConfirmDelete}>
                Yes, {isClearingCart ? 'Clear All' : 'Remove'}
              </button>
              <button className="btn-secondary" onClick={closeConfirmDialog}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Header */}
      <div className="cart-header">
        <h2 className="cart-title">
          <BsCart4 size={30} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Your Shopping Cart
        </h2>
        {cartItems.length > 0 && (
          <button
            className="clear-cart-button"
            onClick={initiateClearCart}
            title="Clear all items from cart"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Cart Content */}
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is currently empty.</p>
          <button
            className="btn-secondary"
            onClick={() => navigate('/')} // Navigate to home or products page
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item"> {/* Ensure item.id is unique */}
                {/* <img
                  src={`${import.meta.env.VITE_PROD_BASE_URL}${item.image}`}
                  alt={item.name || 'Product image'}
                  className="cart-item-image"
                /> */}
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name || 'Unnamed Item'}</h3>
                  <p className="cart-item-price">
                    ₹{getItemPrice(item).toLocaleString()}
                    {item.rentPrice ? <span className="rent-indicator"> /day</span> : ''}
                  </p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, -1)} disabled={(item.quantity || 1) <= 1}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
                </div>
                <button
                  className="delete-item-button"
                  onClick={() => initiateDeleteItem(item.id)}
                  title={`Remove ${item.name || 'item'}`}
                >
                  <FaTrashAlt size={18} />
                </button>
              </li>
            ))}
          </ul>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total Amount:</span>
              {/* Format total amount */}
              <span>₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="cart-buttons">
              <button
                className="checkout-button btn-primary" // Added btn-primary for consistency
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;