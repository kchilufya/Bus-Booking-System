const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

// Get all buses
router.get('/', busController.getAllBuses);

// Get bus by ID
router.get('/:id', busController.getBusById);

// Create new bus
router.post('/', busController.createBus);

module.exports = router;