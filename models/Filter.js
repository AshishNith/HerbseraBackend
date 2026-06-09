const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Filter name is required'],
    trim: true,
  },
  searchQuery: {
    type: String,
    required: [true, 'Search query is required'],
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Filter', filterSchema);
