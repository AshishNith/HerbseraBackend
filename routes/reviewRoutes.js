const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} = require('../controllers/reviewController');
const { verifyFirebaseToken, optionalAuth } = require('../middleware/auth');
const { reviewValidation } = require('../middleware/validation');

// Public routes
router.get('/product/:productId', optionalAuth, getProductReviews);

// Protected routes
router.post('/', verifyFirebaseToken, reviewValidation.create, createReview);
router.put('/:id', verifyFirebaseToken, updateReview);
router.delete('/:id', verifyFirebaseToken, deleteReview);
router.post('/:id/helpful', verifyFirebaseToken, markHelpful);

module.exports = router;
