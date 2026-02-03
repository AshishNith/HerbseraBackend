const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderDetails,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { verifyFirebaseToken, isAdmin } = require('../middleware/auth');
const { orderValidation } = require('../middleware/validation');

// User routes (protected)
router.post('/', verifyFirebaseToken, orderValidation.create, createOrder);
router.get('/my-orders', verifyFirebaseToken, getMyOrders);
router.get('/:id', verifyFirebaseToken, getOrderDetails);
router.put('/:id/cancel', verifyFirebaseToken, cancelOrder);

// Admin routes
router.get('/', verifyFirebaseToken, isAdmin, getAllOrders);
router.put('/:id/status', verifyFirebaseToken, isAdmin, updateOrderStatus);

module.exports = router;
