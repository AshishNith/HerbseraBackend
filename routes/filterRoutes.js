const express = require('express');
const router = express.Router();
const { verifyFirebaseToken, isAdmin } = require('../middleware/auth');
const filterController = require('../controllers/filterController');

// Public route to fetch active filters
router.get('/', filterController.getFilters);

// Protected Admin CRUD routes
router.use(verifyFirebaseToken);
router.use(isAdmin);

router.get('/admin', filterController.getAllFilters);
router.post('/', filterController.createFilter);
router.put('/:id', filterController.updateFilter);
router.delete('/:id', filterController.deleteFilter);

module.exports = router;
