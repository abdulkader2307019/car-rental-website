const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  try {
    // Check if auth header exists and has bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Check if token exists in cookies
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route - no token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route - invalid token'
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
};

module.exports = { protect, isAdmin };