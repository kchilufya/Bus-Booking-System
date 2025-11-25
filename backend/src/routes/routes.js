const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Get all routes
router.get('/', routeController.getAllRoutes);

// Search routes
router.get('/search', routeController.searchRoutes);

// Get route by ID
router.get('/:id', routeController.getRouteById);

// Create new route
router.post('/', routeController.createRoute);

module.exports = router;