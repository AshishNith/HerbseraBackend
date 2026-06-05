const Razorpay = require('razorpay');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

/**
 * Helper function to calculate cart total securely on the server side
 */
const calculateCartTotal = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    const error = new Error('Cart is empty');
    error.statusCode = 400;
    throw error;
  }

  let subtotal = 0;
  for (const item of cart.items) {
    if (!item.product) {
      const error = new Error('One or more products in your cart are no longer available');
      error.statusCode = 400;
      throw error;
    }
    subtotal += item.product.price * item.quantity;
  }

  const tax = subtotal * 0.18; // 18% GST
  const shippingCost = subtotal >= 500 ? 0 : 50;
  const total = subtotal + tax + shippingCost;

  return {
    subtotal,
    tax,
    shippingCost,
    total,
  };
};

/**
 * Create Razorpay Order (Protected)
 */
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { total } = await calculateCartTotal(req.user._id);

    const options = {
      amount: Math.round(total * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `rcpt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Stripe Payment Intent (Protected)
 */
exports.createStripePaymentIntent = async (req, res, next) => {
  try {
    const { total } = await calculateCartTotal(req.user._id);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe expects amount in cents
      currency: 'inr',
      metadata: { userId: req.user._id.toString() },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      },
    });
  } catch (error) {
    next(error);
  }
};
