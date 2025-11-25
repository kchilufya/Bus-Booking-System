const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Initialize Mobile Money Payment (Demo)
exports.initializeMobileMoneyPayment = async (req, res) => {
    try {
        const { bookingId, phoneNumber, provider, amount, email, name } = req.body;

        // Create payment record
        const payment = new Payment({
            bookingId,
            userId: req.user ? req.user.id : null,
            amount,
            paymentMethod: 'mobileMoney',
            transactionId: `MM-${Date.now()}`,
            status: 'completed' // Auto-complete for demo
        });
        await payment.save();

        // Update booking status
        await Booking.findByIdAndUpdate(
            bookingId,
            { 
                bookingStatus: 'confirmed',
                paymentStatus: 'paid'
            }
        );

        res.status(200).json({
            success: true,
            message: 'Payment completed successfully (Demo Mode)',
            data: {
                tx_ref: payment.transactionId,
                status: 'successful'
            },
            paymentId: payment._id
        });
    } catch (error) {
        console.error('Mobile Money Payment Error:', error);
        res.status(500).json({ success: false, message: 'Payment processing error', error: error.message });
    }
};

// Initialize Card Payment (Demo)
exports.initializeCardPayment = async (req, res) => {
    try {
        const { bookingId, amount, email, name, cardDetails } = req.body;

        // Create payment record
        const payment = new Payment({
            bookingId,
            userId: req.user ? req.user.id : null,
            amount,
            paymentMethod: 'card',
            transactionId: `CARD-${Date.now()}`,
            status: 'completed' // Auto-complete for demo
        });
        await payment.save();

        // Update booking status
        await Booking.findByIdAndUpdate(
            bookingId,
            { 
                bookingStatus: 'confirmed',
                paymentStatus: 'paid'
            }
        );

        res.status(200).json({
            success: true,
            message: 'Payment completed successfully (Demo Mode)',
            data: {
                tx_ref: payment.transactionId,
                status: 'successful'
            },
            paymentId: payment._id
        });
    } catch (error) {
        console.error('Card Payment Error:', error);
        res.status(500).json({ success: false, message: 'Payment processing error', error: error.message });
    }
};

// Validate Card PIN (Demo)
exports.validateCardPin = async (req, res) => {
    try {
        res.status(200).json({ 
            success: true, 
            message: 'PIN validated successfully (Demo Mode)' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'PIN validation error', error: error.message });
    }
};

// Validate OTP (Demo)
exports.validateOtp = async (req, res) => {
    try {
        res.status(200).json({ 
            success: true, 
            message: 'OTP validated successfully (Demo Mode)' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'OTP validation error', error: error.message });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { transaction_id } = req.query;

        const payment = await Payment.findOne({ transactionId: transaction_id });

        if (payment) {
            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                payment
            });
        } else {
            res.status(404).json({ success: false, message: 'Payment record not found' });
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ success: false, message: 'Payment verification error', error: error.message });
    }
};

// Get Payment Status
exports.getPaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId).populate('bookingId');

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        res.status(200).json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching payment status', error: error.message });
    }
};