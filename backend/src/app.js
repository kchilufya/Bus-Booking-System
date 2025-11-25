const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/buses');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const routeRoutes = require('./routes/routes'); // Add this line
const adminRoutes = require('./routes/admin');
require('dotenv').config();
console.log('JWT_SECRET set?', !!process.env.JWT_SECRET);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'Bus Booking System API is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/routes', routeRoutes); // Add this line
app.use('/api/admin', adminRoutes);

// Database connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});