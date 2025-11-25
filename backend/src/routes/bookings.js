const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authUser = require('../middleware/authUser');

// Protect create booking
router.post('/', authUser, bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Update booking
router.put('/:id', bookingController.updateBooking);

// Cancel booking
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;