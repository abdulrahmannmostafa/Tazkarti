const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminData = {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      email: 'admin@epl.com',
      firstName: 'Site',
      lastName: 'Administrator',
      birthDate: new Date('1990-01-01'),
      gender: 'male',
      city: 'Cairo',
      role: 'admin',
      isApproved: true
    };
    
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }
    
    const admin = new User(adminData);
    await admin.save();
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();