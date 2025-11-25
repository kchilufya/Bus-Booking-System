const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

// Create new booking
exports.createBooking = async (req, res) => {
    try {
        const { busId, routeId, seats, passengerName, passengerEmail, passengerPhone, totalAmount } = req.body;

        // Validate required fields
        if (!busId || !routeId || !seats || !passengerName || !passengerEmail || !passengerPhone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Check if bus exists
        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({ 
                success: false, 
                message: 'Bus not found' 
            });
        }

        // Check if seats are available
        if (bus.availableSeats < seats.length) {
            return res.status(400).json({ 
                success: false, 
                message: 'Not enough available seats' 
            });
        }

        // Create booking
        const booking = new Booking({
            busId,
            routeId,
            seats,
            passengerName,
            passengerEmail,
            passengerPhone,
            totalAmount: totalAmount || seats.length * 150,
            bookingStatus: 'pending',
            paymentStatus: 'pending'
        });

        await booking.save();

        // Update bus available seats (use findByIdAndUpdate to avoid validation issues)
        await Bus.findByIdAndUpdate(
            busId,
            { $inc: { availableSeats: -seats.length } },
            { new: true }
        );

        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating booking', 
            error: error.message 
        });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('busId')
            .populate('routeId')
            .sort({ createdAt: -1 });
        
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching bookings', 
            error: error.message 
        });
    }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('busId')
            .populate('routeId');

        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching booking', 
            error: error.message 
        });
    }
};

// Update booking
exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating booking', 
            error: error.message 
        });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }

        // Update booking status
        booking.bookingStatus = 'cancelled';
        await booking.save();

        // Return seats to bus using findByIdAndUpdate
        await Bus.findByIdAndUpdate(
            booking.busId,
            { $inc: { availableSeats: booking.seats.length } },
            { new: true }
        );

        res.status(200).json({ 
            success: true, 
            message: 'Booking cancelled successfully', 
            booking 
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error cancelling booking', 
            error: error.message 
        });
    }
};