const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'inactive'],
        default: 'active'
    },
    seatConfiguration: [{
        seatNumber: Number,
        type: {
            type: String,
            enum: ['window', 'aisle'],
            default: 'aisle'
        },
        price: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Bus', busSchema);