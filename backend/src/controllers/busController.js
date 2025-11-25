const Bus = require('../models/Bus');

// Get all buses
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find({ status: 'active' }).populate('routeId');
        res.status(200).json(buses);
    } catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ message: 'Error fetching buses', error: error.message });
    }
};

// Get bus by ID
exports.getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id).populate('routeId');
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.status(200).json(bus);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bus', error: error.message });
    }
};

// Create new bus
exports.createBus = async (req, res) => {
    try {
        const bus = new Bus(req.body);
        await bus.save();
        res.status(201).json(bus);
    } catch (error) {
        res.status(400).json({ message: 'Error creating bus', error: error.message });
    }
};