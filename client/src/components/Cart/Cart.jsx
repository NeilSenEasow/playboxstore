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
      return total + formatPrice(itemPrice) * item.quantity; // Multiply by quantity
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    const totalCost = calculateTotal(groupedItems); // Calculate total cost
    navigate('/checkout', { state: { totalCost } }); // Pass total cost as state
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

  const handleQuantityChange = (itemId, change) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: Math.max(1, (item.quantity || 0) + change) } : item
      )
    );
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
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">
                    ₹{(item.rentPrice || item.price).toLocaleString()}
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
