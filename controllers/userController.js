const User = require('../models/User');

/**
 * Get current user profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name price images benefit')
      .select('-__v');

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { displayName, phoneNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { displayName, phoneNumber },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add address to user profile
 */
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // If this is the first address or isDefault is true, make it default
    if (user.addresses.length === 0 || req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    res.json({
      success: true,
      message: 'Address added successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update address
 */
exports.updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // If making this address default, unset other defaults
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    Object.assign(address, req.body);
    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete address
 */
exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    user.addresses.pull(addressId);
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add product to wishlist
 */
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    await user.populate('wishlist', 'name price images benefit');

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove product from wishlist
 */
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist.pull(productId);
    await user.save();

    await user.populate('wishlist', 'name price images benefit');

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users (Admin only)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find()
      .select('-__v')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments();

    res.json({
      success: true,
      data: users,
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
