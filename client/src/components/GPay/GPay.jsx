import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './GPay.css';
import GooglePayButton from '@google-pay/button-react';

function GPay() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state
  if (!location.state || !location.state.amount) {
    navigate('/payment');
    return null;
  }

  const { amount, orderDetails, cartItems } = location.state;

  const handlePaymentSuccess = async (paymentRequest) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems,
          orderDetails,
          paymentDetails: {
            method: 'GPAY',
            amount: amount,
            transactionId: paymentRequest.transactionId || Date.now().toString(),
            status: 'SUCCESS'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      // Clear cart data
      sessionStorage.removeItem('checkoutFormData');
      localStorage.removeItem('cartItems');

      // Show success and redirect
      navigate('/payment-success', {
        state: {
          orderId: Date.now().toString(),
          amount: amount,
          paymentMethod: 'Google Pay'
        }
      });
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error processing your order. Please try again.');
      navigate('/cart');
    }
  };

  return (
    <div className="gpay-container">
      <div className="gpay-card">
        <div className="gpay-header">
          <h2>Google Pay</h2>
          <div className="amount">₹{amount.toLocaleString()}</div>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity || 1}</p>
                  <p>₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <GooglePayButton
          environment="TEST"
          buttonColor="black"
          buttonType="pay"
          buttonSizeMode="fill"
          paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: 'CARD',
                parameters: {
                  allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                  allowedCardNetworks: ['MASTERCARD', 'VISA'],
                },
                tokenizationSpecification: {
                  type: 'PAYMENT_GATEWAY',
                  parameters: {
                    gateway: 'example',
                    gatewayMerchantId: 'exampleGatewayMerchantId',
                  },
                },
              },
            ],
            merchantInfo: {
              merchantId: '12345678901234567890',
              merchantName: 'PlayBox Store',
              merchantOrigin: window.location.origin
            },
            transactionInfo: {
              totalPriceStatus: 'FINAL',
              totalPriceLabel: 'Total',
              totalPrice: amount.toFixed(2),
              currencyCode: 'INR',
              countryCode: 'IN',
              displayItems: [
                {
                  label: "Order Total",
                  price: amount.toFixed(2),
                  type: "SUBTOTAL"
                }
              ]
            },
            callbackIntents: ['PAYMENT_AUTHORIZATION']
          }}
          onLoadPaymentData={handlePaymentSuccess}
          onError={(error) => {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
          }}
          existingPaymentMethodRequired={false}
          buttonLocale="en"
        />

        <div className="gpay-footer">
          <p>Secure Payment via Google Pay</p>
          <button 
            className="back-button"
            onClick={() => navigate('/payment')}
          >
            Back to Payment Options
          </button>
        </div>
      </div>
    </div>
  );
}

export default GPay;