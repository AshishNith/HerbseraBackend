const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getAllUsers,
} = require('../controllers/userController');
const { verifyFirebaseToken, isAdmin } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');

// User routes (protected)
router.get('/profile', verifyFirebaseToken, getProfile);
router.put('/profile', verifyFirebaseToken, userValidation.updateProfile, updateProfile);

// Address routes
router.post('/addresses', verifyFirebaseToken, userValidation.addAddress, addAddress);
router.put('/addresses/:addressId', verifyFirebaseToken, updateAddress);
router.delete('/addresses/:addressId', verifyFirebaseToken, deleteAddress);

// Wishlist routes
router.post('/wishlist', verifyFirebaseToken, addToWishlist);
router.delete('/wishlist/:productId', verifyFirebaseToken, removeFromWishlist);

// Admin routes
router.get('/', verifyFirebaseToken, isAdmin, getAllUsers);

module.exports = router;
