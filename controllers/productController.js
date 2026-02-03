const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

/**
 * Get all products with filtering, sorting, and pagination
 */
exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      featured,
      search,
      sort = '-createdAt',
      minPrice,
      maxPrice,
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
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
 * Get single product by ID or slug
 */
exports.getProduct = async (req, res, next) => {
  try {
    const { id, slug } = req.params;
    const identifier = slug || id;
    
    // Try to find by ID first, then by slug
    let product = null;
    
    // Check if it's a valid MongoDB ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier);
    }
    
    // If not found by ID or not a valid ID, try by slug
    if (!product) {
      product = await Product.findOne({ slug: identifier, isActive: true });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product (Admin only)
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product (Admin only)
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (Admin only)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete images from cloudinary if any
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured products
 */
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .sort('-createdAt')
      .limit(8)
      .select('-__v');

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
