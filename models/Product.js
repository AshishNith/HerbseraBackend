const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  benefit: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0,
  },
  comparePrice: {
    type: Number,
    min: 0,
  },
  images: [{
    url: String,
    publicId: String,
    alt: String,
  }],
  category: {
    type: String,
    required: true,
    enum: ['soap', 'oil', 'cream', 'powder', 'other'],
    default: 'soap',
  },
  ingredients: [{
    name: String,
    percentage: Number,
  }],
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg', 'ml', 'l'],
      default: 'g',
    },
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  sku: {
    type: String,
    unique: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  tags: [String],
  seoTitle: String,
  seoDescription: String,
}, {
  timestamps: true,
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, featured: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
