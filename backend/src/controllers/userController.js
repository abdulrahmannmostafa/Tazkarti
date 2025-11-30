const bcrypt = require('bcryptjs');
const User = require('../models/User');
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getPendingManagers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      isApproved: false
    }).select('-password').sort({ createdAt: -1 });

    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve user (Admin only)
exports.approveManager = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isApproved) {
      return res.status(400).json({ message: 'User is already approved' });
    }

    user.isApproved = true;
    await user.save();

    const roleNames = {
      'admin': 'Administrator',
      'manager': 'EFA Manager',
      'fan': 'Fan'
    };

    res.json({
      message: `${roleNames[user.role] || 'User'} approved successfully. They can now login.`,
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
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};