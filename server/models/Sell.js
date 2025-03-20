const mongoose = require('mongoose');

const sellSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  sellDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    landmark: { type: String }
  },
  name: { type: String, required: true }, // Item name
  category: { type: String, required: true }, // Item category
  condition: { type: String, required: true }, // Item condition
  description: { type: String, required: true }, // Item description
  price: { type: Number, required: true }, // Item price
  image: { type: String, required: false } // Item image
}, { timestamps: true });

sellSchema.index({ productId: 1, userId: 1 }); // Adding a compound index for better query performance

module.exports = mongoose.model('Sell', sellSchema); 