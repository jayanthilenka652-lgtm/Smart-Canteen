const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Morning', 'Afternoon', 'Evening']
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 10
  },
  bookedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Slot', slotSchema);
