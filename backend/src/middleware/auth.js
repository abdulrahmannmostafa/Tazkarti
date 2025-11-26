const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and authenticate user
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found, token is invalid' });
    }
    
    // Attach user to request object
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

// Middleware to check if user has required role(s)
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}` 
      });
    }
    
    next();
  };
};

// Middleware to check if user (manager) is approved by admin
const requireApproval = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // Only managers need approval, admins and fans are always approved
  if (req.user.role === 'manager' && !req.user.isApproved) {
    return res.status(403).json({ 
      message: 'Your account is pending Site Administrator approval. Please wait for approval before accessing this resource.' 
    });
  }
  
  next();
};

// Optional: Middleware to check if user is approved (for any role)
const checkApproval = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (!req.user.isApproved) {
    return res.status(403).json({ 
      message: 'Your account has not been approved yet' 
    });
  }
  
  next();
};

module.exports = { 
  auth, 
  requireRole, 
  requireApproval,
  checkApproval 
};