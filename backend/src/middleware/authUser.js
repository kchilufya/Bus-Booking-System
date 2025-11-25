const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  console.log('[authUser] Authorization header:', header);

  if (!header || !header.startsWith('Bearer ')) {
    console.log('[authUser] No Bearer token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const payload = jwt.verify(token, secret);
    console.log('[authUser] JWT payload:', payload);

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      console.log('[authUser] User not found for id:', payload.id);
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.log('[authUser] JWT verify error:', err.message);
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};