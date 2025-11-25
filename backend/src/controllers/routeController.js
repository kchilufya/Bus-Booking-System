const Route = require('../models/Route');

// Get all routes
exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        res.status(200).json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving routes', error: error.message });
    }
};

// Get route by ID
exports.getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.status(200).json(route);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving route', error: error.message });
    }
};

// Search routes by startLocation and destination
exports.searchRoutes = async (req, res) => {
    try {
        const { startLocation, destination } = req.query;
        
        const query = {};
        if (startLocation) query.startLocation = new RegExp(startLocation, 'i');
        if (destination) query.destination = new RegExp(destination, 'i');
        
        const routes = await Route.find(query);
        res.status(200).json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Error searching routes', error: error.message });
    }
};

// Create new route (admin function)
exports.createRoute = async (req, res) => {
    try {
        const newRoute = new Route(req.body);
        await newRoute.save();
        res.status(201).json(newRoute);
    } catch (error) {
        res.status(500).json({ message: 'Error creating route', error: error.message });
    }
};