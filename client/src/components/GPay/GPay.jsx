import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GPay.css';
import GooglePayButton from '@google-pay/button-react';

function GPay({ amount }) {
  const navigate = useNavigate();

  return (
    <div className="gpay-container">
      <div className="gpay-card">
        <div className="gpay-header">
          <h2>Google Pay</h2>
          <div className="amount">₹{amount || '0.00'}</div>
        </div>

        <GooglePayButton
          environment="TEST"
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
            },
            transactionInfo: {
              totalPriceStatus: 'FINAL',
              totalPriceLabel: 'Total',
              totalPrice: amount.toFixed(2), // Use the amount prop for total price
              currencyCode: 'USD',
              countryCode: 'US',
            },
          }}
          onLoadPaymentData={paymentRequest => {
            console.log('load payment data', paymentRequest);
            // Navigate to success page after payment
            navigate('/payment-success');
          }}
        />

        <div className="gpay-footer">
          <p>Secure Payment via Google Pay</p>
        </div>
      </div>
    </div>
  );
}

export default GPay;