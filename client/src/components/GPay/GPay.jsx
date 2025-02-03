import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './GPay.css';
import GooglePayButton from '@google-pay/button-react';

function GPay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderDetails, cartItems } = location.state || {};
  const amount = location.state?.amount || 0;

  const handlePaymentSuccess = async (paymentRequest) => {
    try {
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`${import.meta.env.VITE_PROD_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          cartItems,
          userId,
          orderDetails
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      localStorage.removeItem('cartItems');
      navigate('/payment-success');
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
              merchantName: 'Demo Merchant',
              merchantOrigin: window.location.origin,
              authJwt: 'your_auth_jwt_here',
              merchantIcon: 'https://your-merchant-icon-url.png',
              icons: [
                {
                  src: 'https://your-icon-url-32x32.png',
                  sizes: '32x32',
                  type: 'image/png'
                },
                {
                  src: 'https://your-icon-url-64x64.png',
                  sizes: '64x64',
                  type: 'image/png'
                }
              ]
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
        </div>
      </div>
    </div>
  );
}

export default GPay;