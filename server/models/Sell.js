const mongoose = require('mongoose');

const sellSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  condition: { 
    type: String, 
    enum: ['like-new', 'excellent', 'good', 'fair'], // Adjust conditions as needed
    required: true 
  },
  image: { type: String, required: true },
  availableQuantity: { type: Number, required: true },
  category: { type: String, required: true }
});

const Sell = mongoose.model('Sell', sellSchema);

module.exports = Sell; 