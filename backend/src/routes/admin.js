const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Public: login
router.post('/login', adminController.login);

// Protected: require valid token
router.get('/dashboard/stats', auth, adminController.getDashboardStats);
router.get('/reports/revenue', auth, adminController.getRevenueReport);
router.get('/reports/bookings', auth, adminController.getBookingsReport);
router.get('/reports/popular-routes', auth, adminController.getPopularRoutes);
router.get('/bookings', auth, adminController.getAllBookings);

module.exports = router;