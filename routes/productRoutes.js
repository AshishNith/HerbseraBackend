const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} = require('../controllers/productController');
const { verifyFirebaseToken, isAdmin, optionalAuth } = require('../middleware/auth');
const { productValidation } = require('../middleware/validation');

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', optionalAuth, getProduct);
router.get('/:id', optionalAuth, getProduct);

// Admin routes
router.post('/', verifyFirebaseToken, isAdmin, productValidation.create, createProduct);
router.put('/:id', verifyFirebaseToken, isAdmin, productValidation.update, updateProduct);
router.delete('/:id', verifyFirebaseToken, isAdmin, deleteProduct);

module.exports = router;
