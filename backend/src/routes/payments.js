const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Initialize payments
router.post('/mobile-money', paymentController.initializeMobileMoneyPayment);
router.post('/card', paymentController.initializeCardPayment);

// Validate card PIN/OTP
router.post('/validate-pin', paymentController.validateCardPin);
router.post('/validate-otp', paymentController.validateOtp);

// Verify payment
router.get('/verify', paymentController.verifyPayment);

// Get payment status
router.get('/:paymentId/status', paymentController.getPaymentStatus);

module.exports = router;