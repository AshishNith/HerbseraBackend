const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/auth');
const { createRazorpayOrder, createStripePaymentIntent } = require('../controllers/paymentController');

// All payment routes require authentication
router.use(verifyFirebaseToken);

router.post('/razorpay/order', createRazorpayOrder);
router.post('/stripe/intent', createStripePaymentIntent);

module.exports = router;
