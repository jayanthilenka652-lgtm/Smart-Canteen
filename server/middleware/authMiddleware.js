const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isFallback, store } = require('../config/db');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smart_canteen_jwt_secret_key_2026_safe');

      if (isFallback()) {
        const foundUser = store.users.find(u => u._id === decoded.id || u.id === decoded.id);
        if (foundUser) {
          req.user = foundUser;
          return next();
        }
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (req.user) return next();
      }
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
  }
};

module.exports = { protect, adminOnly };
