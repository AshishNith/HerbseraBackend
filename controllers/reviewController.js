const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Get product reviews
 */
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const reviews = await Review.find({ product: productId, isApproved: true })
      .populate('user', 'displayName photoURL')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments({ product: productId, isApproved: true });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create product review
 */
exports.createReview = async (req, res, next) => {
  try {
    const { product, rating, title, comment } = req.body;

    // Check if product exists
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.exists({
      user: req.user._id,
      'items.product': product,
      status: 'delivered',
    });

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    const review = await Review.create({
      product,
      user: req.user._id,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!hasPurchased,
    });

    await review.populate('user', 'displayName photoURL');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update review
 */
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;

    await review.save();
    await review.populate('user', 'displayName photoURL');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete review
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark review as helpful
 */
exports.markHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    ).populate('user', 'displayName photoURL');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
