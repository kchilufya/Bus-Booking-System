const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, isActive: true });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);

    const totalBookings = await Booking.countDocuments();
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: today } });

    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const todayRevenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    const totalBuses = await Bus.countDocuments({ status: 'active' });
    const totalRoutes = await Route.countDocuments();
    const pendingBookings = await Booking.countDocuments({ paymentStatus: 'pending' });

    res.json({ totalBookings, todayBookings, totalRevenue, todayRevenue, totalBuses, totalRoutes, pendingBookings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { paymentStatus: 'paid' };

    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const report = await Booking.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'routes',
          localField: 'routeId',
          foreignField: '_id',
          as: 'route'
        }
      },
      { $unwind: '$route' },
      {
        $group: {
          _id: '$routeId',
          routeName: { $first: { $concat: ['$route.startLocation', ' → ', '$route.destination'] } },
          totalRevenue: { $sum: '$totalAmount' },
          bookingsCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getBookingsReport = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const match = {};

    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (status) match.paymentStatus = status;

    const bookings = await Booking.find(match)
      .populate('routeId', 'startLocation destination')
      .populate('busId', 'busNumber')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPopularRoutes = async (req, res) => {
  try {
    const popular = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: '$routeId', bookingsCount: { $sum: 1 }, totalRevenue: { $sum: '$totalAmount' } } },
      {
        $lookup: {
          from: 'routes',
          localField: '_id',
          foreignField: '_id',
          as: 'route'
        }
      },
      { $unwind: '$route' },
      {
        $project: {
          routeName: { $concat: ['$route.startLocation', ' → ', '$route.destination'] },
          bookingsCount: 1,
          totalRevenue: 1
        }
      },
      { $sort: { bookingsCount: -1 } },
      { $limit: 10 }
    ]);

    res.json(popular);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find()
      .populate('routeId', 'startLocation destination')
      .populate('busId', 'busNumber departureTime')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments();

    res.json({
      bookings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBookings: total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};