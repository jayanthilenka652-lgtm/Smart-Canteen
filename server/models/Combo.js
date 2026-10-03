const mongoose = require('mongoose');

const comboItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1
  }
}, { _id: false });

const comboSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Combo name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  items: [comboItemSchema],
  price: {
    type: Number,
    required: [true, 'Combo price is required'],
    min: 0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Combo', comboSchema);
