const { body, param, query, validationResult } = require('express-validator');

/**
 * Validate request and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Product validation rules
const productValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('benefit').trim().notEmpty().withMessage('Benefit is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isIn(['soap', 'oil', 'cream', 'powder', 'other']).withMessage('Invalid category'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    validate,
  ],
  update: [
    body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    validate,
  ],
};

// Order validation rules
const orderValidation = {
  create: [
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('items.*.product').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress.name').trim().notEmpty().withMessage('Recipient name is required'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
    body('shippingAddress.addressLine1').trim().notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
    body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode is required'),
    body('paymentMethod').isIn(['razorpay', 'stripe', 'cod']).withMessage('Invalid payment method'),
    validate,
  ],
};

// Review validation rules
const reviewValidation = {
  create: [
    body('product').notEmpty().withMessage('Product ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Review comment is required')
      .isLength({ min: 10 }).withMessage('Comment must be at least 10 characters'),
    validate,
  ],
};

// Cart validation rules
const cartValidation = {
  addItem: [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate,
  ],
  updateItem: [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate,
  ],
};

// User validation rules
const userValidation = {
  updateProfile: [
    body('displayName').optional().trim().notEmpty().withMessage('Display name cannot be empty'),
    body('phoneNumber').optional().trim().isMobilePhone().withMessage('Invalid phone number'),
    validate,
  ],
  addAddress: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('addressLine1').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('pincode').trim().notEmpty().withMessage('Pincode is required'),
    validate,
  ],
};

module.exports = {
  validate,
  productValidation,
  orderValidation,
  reviewValidation,
  cartValidation,
  userValidation,
};
