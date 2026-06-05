const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const emailService = require('../services/emailService');

/**
 * Create new order
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentInfo } = req.body;

    // Verify online payments server-side
    let savedPaymentInfo = {};
    if (paymentMethod === 'razorpay') {
      if (!paymentInfo || !paymentInfo.razorpay_payment_id || !paymentInfo.razorpay_order_id || !paymentInfo.razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Razorpay payment verification details are missing.',
        });
      }

      const crypto = require('crypto');
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
        .update(`${paymentInfo.razorpay_order_id}|${paymentInfo.razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== paymentInfo.razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Razorpay payment signature. Verification failed.',
        });
      }

      savedPaymentInfo = {
        id: paymentInfo.razorpay_payment_id,
        status: 'paid',
        paidAt: new Date(),
      };
    } else if (paymentMethod === 'stripe') {
      if (!paymentInfo || !paymentInfo.id) {
        return res.status(400).json({
          success: false,
          message: 'Stripe payment intent ID is missing.',
        });
      }

      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentInfo.id);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: `Stripe payment intent status is: ${paymentIntent.status}. Expected: succeeded.`,
        });
      }

      savedPaymentInfo = {
        id: paymentInfo.id,
        status: 'paid',
        paidAt: new Date(),
      };
    } else if (paymentMethod === 'cod') {
      savedPaymentInfo = {
        id: `cod_${Date.now()}`,
        status: 'pending',
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method.',
      });
    }

    // Validate products and calculate prices
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        quantity: item.quantity,
        price: product.price,
      });

      subtotal += product.price * item.quantity;

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate pricing
    const tax = subtotal * 0.18; // 18% GST
    const shippingCost = subtotal >= 500 ? 0 : 50;
    const total = subtotal + tax + shippingCost;

    // Generate unique order number
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `ORD-${timestamp}-${random}`;
    };

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentInfo: savedPaymentInfo,
      pricing: {
        subtotal,
        tax,
        shippingCost,
        discount: 0,
        total,
      },
    });

    // Clear user's cart after order
    await Cart.findOneAndDelete({ user: req.user._id });

    // Send order confirmation email
    if (req.user && req.user.email) {
      emailService.sendOrderConfirmation(req.user.email, order).catch(err => {
        console.error('Failed to send order confirmation email:', err);
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's orders
 */
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: orders,
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
 * Get single order details
 */
exports.getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('items.product', 'name images benefit')
      .populate('user', 'displayName email phoneNumber');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel order
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Can only cancel pending or processing orders
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    // Send cancellation email
    await order.populate('user', 'email');
    if (order.user && order.user.email) {
      emailService.sendOrderStatusUpdate(order.user.email, order).catch(err => {
        console.error('Failed to send order status cancellation email:', err);
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders (Admin only)
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate('user', 'displayName email')
      .populate('items.product', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
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
 * Update order status (Admin only)
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') order.deliveredAt = new Date();

    await order.save();

    // Send status update email
    await order.populate('user', 'email');
    if (order.user && order.user.email) {
      emailService.sendOrderStatusUpdate(order.user.email, order).catch(err => {
        console.error('Failed to send order status update email:', err);
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
