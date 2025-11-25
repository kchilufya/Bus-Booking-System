const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    startLocation: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    stops: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Route', routeSchema);