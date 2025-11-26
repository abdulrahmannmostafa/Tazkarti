const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending managers (Admin only)
exports.getPendingManagers = async (req, res) => {
  try {
    const pendingManagers = await User.find({ 
      role: 'manager', 
      isApproved: false 
    }).select('-password').sort({ createdAt: -1 });
    
    res.json(pendingManagers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve manager (Admin only)
exports.approveManager = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'manager') {
      return res.status(400).json({ message: 'Only managers require approval' });
    }
    
    if (user.isApproved) {
      return res.status(400).json({ message: 'User is already approved' });
    }
    
    user.isApproved = true;
    await user.save();
    
    res.json({ 
      message: 'EFA Manager approved successfully. They can now login and manage matches.',
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

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Check if user is an admin
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete another administrator account' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: `User ${user.username} deleted successfully`,
      deletedUser: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update own profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, birthDate, gender, city, address, password } = req.body;
    
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (birthDate) updates.birthDate = birthDate;
    if (gender) updates.gender = gender;
    if (city) updates.city = city;
    if (address !== undefined) updates.address = address;
    
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};