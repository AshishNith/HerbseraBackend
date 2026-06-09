const Filter = require('../models/Filter');

/**
 * Get active filters (Public)
 */
exports.getFilters = async (req, res, next) => {
  try {
    const filters = await Filter.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .select('-__v');
    res.json({
      success: true,
      data: filters
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all filters (Admin only)
 */
exports.getAllFilters = async (req, res, next) => {
  try {
    const filters = await Filter.find()
      .sort({ sortOrder: 1, createdAt: 1 })
      .select('-__v');
    res.json({
      success: true,
      data: filters
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new filter (Admin only)
 */
exports.createFilter = async (req, res, next) => {
  try {
    const { name, searchQuery, isActive, sortOrder } = req.body;
    const filter = await Filter.create({
      name,
      searchQuery,
      isActive,
      sortOrder
    });
    res.status(201).json({
      success: true,
      message: 'Filter created successfully',
      data: filter
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing filter (Admin only)
 */
exports.updateFilter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, searchQuery, isActive, sortOrder } = req.body;
    
    const filter = await Filter.findByIdAndUpdate(
      id,
      { name, searchQuery, isActive, sortOrder },
      { new: true, runValidators: true }
    );

    if (!filter) {
      return res.status(404).json({
        success: false,
        message: 'Filter not found'
      });
    }

    res.json({
      success: true,
      message: 'Filter updated successfully',
      data: filter
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a filter (Admin only)
 */
exports.deleteFilter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const filter = await Filter.findByIdAndDelete(id);

    if (!filter) {
      return res.status(404).json({
        success: false,
        message: 'Filter not found'
      });
    }

    res.json({
      success: true,
      message: 'Filter deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
