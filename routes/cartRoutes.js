const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { verifyFirebaseToken } = require('../middleware/auth');
const { cartValidation } = require('../middleware/validation');

// All cart routes require authentication
router.get('/', verifyFirebaseToken, getCart);
router.post('/', verifyFirebaseToken, cartValidation.addItem, addToCart);
router.put('/:itemId', verifyFirebaseToken, cartValidation.updateItem, updateCartItem);
router.delete('/:itemId', verifyFirebaseToken, removeFromCart);
router.delete('/', verifyFirebaseToken, clearCart);

module.exports = router;
