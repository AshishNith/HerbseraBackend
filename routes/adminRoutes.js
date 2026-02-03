const express = require('express');
const router = express.Router();
const { verifyFirebaseToken, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(verifyFirebaseToken);
router.use(isAdmin);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/role', adminController.updateUserRole);
router.patch('/users/:userId/toggle-status', adminController.toggleUserStatus);

// Product management
router.get('/products', adminController.getAllProducts);
router.put('/products/:productId', adminController.updateProduct);
router.delete('/products/:productId', adminController.deleteProduct);

// Order management
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:orderId', adminController.getOrderDetails);
router.patch('/orders/:orderId/status', adminController.updateOrderStatus);

// Review management
router.get('/reviews', adminController.getAllReviews);
router.delete('/reviews/:reviewId', adminController.deleteReview);

module.exports = router;
