const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, birthDate, gender, city, address, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      birthDate,
      gender,
      city,
      address,
      role,
      isApproved: role === 'fan' // Fans auto-approved, managers need admin approval
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: role === 'fan' 
        ? 'Registration successful. You can now login.' 
        : 'Registration successful. Your account is pending Site Administrator approval.',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if manager is approved
    if (user.role === 'manager' && !user.isApproved) {
      return res.status(403).json({ 
        message: 'Your account is pending Site Administrator approval. Please wait for approval before logging in.' 
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};