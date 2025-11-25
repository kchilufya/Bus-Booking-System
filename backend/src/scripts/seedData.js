const mongoose = require('mongoose');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
require('dotenv').config();

// Function to generate seat configuration (No VIP seats)
const generateSeatConfiguration = (capacity) => {
    const seats = [];
    
    for (let i = 1; i <= capacity; i++) {
        let seatType = 'aisle';
        let price = 150; // Base price
        
        // Window seats (assuming 4 seats per row: 2 on each side)
        // Seats 1, 4, 5, 8, 9, 12, etc. are window seats
        if (i % 4 === 1 || i % 4 === 0) {
            seatType = 'window';
            price = 150; // Same price as aisle
        }
        
        seats.push({
            seatNumber: i,
            type: seatType,
            price: price
        });
    }
    
    return seats;
};

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/bus-booking');
        console.log('Connected to MongoDB');

        // Clear existing data
        await Route.deleteMany({});
        await Bus.deleteMany({});
        console.log('Cleared existing data');

        // Create Routes
        const routes = await Route.insertMany([
            {
                startLocation: 'Lusaka',
                destination: 'Ndola',
                distance: 320,
                duration: '5 hours',
                fare: 150
            },
            {
                startLocation: 'Lusaka',
                destination: 'Kitwe',
                distance: 350,
                duration: '5.5 hours',
                fare: 180
            },
            {
                startLocation: 'Lusaka',
                destination: 'Livingstone',
                distance: 480,
                duration: '7 hours',
                fare: 200
            },
            {
                startLocation: 'Ndola',
                destination: 'Kitwe',
                distance: 50,
                duration: '1 hour',
                fare: 50
            },
            {
                startLocation: 'Lusaka',
                destination: 'Kabwe',
                distance: 140,
                duration: '2 hours',
                fare: 80
            },
            {
                startLocation: 'Lusaka',
                destination: 'Mongu',
                distance: 580,
                duration: '8 hours',
                fare: 250
            }
        ]);
        console.log('Routes created:', routes.length);

        // Create Buses with seat configuration
        const buses = await Bus.insertMany([
            {
                busNumber: 'ZB-001',
                capacity: 50,
                availableSeats: 50,
                routeId: routes[0]._id,
                departureTime: '08:00',
                arrivalTime: '13:00',
                seatConfiguration: generateSeatConfiguration(50)
            },
            {
                busNumber: 'ZB-002',
                capacity: 45,
                availableSeats: 45,
                routeId: routes[0]._id,
                departureTime: '14:00',
                arrivalTime: '19:00',
                seatConfiguration: generateSeatConfiguration(45)
            },
            {
                busNumber: 'ZB-003',
                capacity: 50,
                availableSeats: 50,
                routeId: routes[1]._id,
                departureTime: '09:00',
                arrivalTime: '14:30',
                seatConfiguration: generateSeatConfiguration(50)
            },
            {
                busNumber: 'ZB-004',
                capacity: 40,
                availableSeats: 40,
                routeId: routes[2]._id,
                departureTime: '07:00',
                arrivalTime: '14:00',
                seatConfiguration: generateSeatConfiguration(40)
            },
            {
                busNumber: 'ZB-005',
                capacity: 45,
                availableSeats: 45,
                routeId: routes[3]._id,
                departureTime: '10:00',
                arrivalTime: '11:00',
                seatConfiguration: generateSeatConfiguration(45)
            },
            {
                busNumber: 'ZB-006',
                capacity: 50,
                availableSeats: 50,
                routeId: routes[4]._id,
                departureTime: '08:30',
                arrivalTime: '10:30',
                seatConfiguration: generateSeatConfiguration(50)
            }
        ]);
        console.log('Buses created:', buses.length);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();