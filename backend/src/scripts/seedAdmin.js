const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/bus-booking');
    console.log('Connected to MongoDB');

    // Remove existing admins (optional)
    await Admin.deleteMany({});

    // Create default admin
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@zambianbus.com',
      password: 'admin123', // will be hashed by Admin model pre-save
      role: 'super-admin'
    });

    console.log('Admin created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email:', admin.email);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();