const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    trim: true,
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
  },
  images: [{
    url: String,
    publicId: String,
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product ratings when review is saved
reviewSchema.post('save', async function() {
  const Review = mongoose.model('Review');
  const Product = mongoose.model('Product');
  
  const stats = await Review.aggregate([
    { $match: { product: this.product } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
      'ratings.count': stats[0].reviewCount,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
