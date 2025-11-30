const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, requireRole } = require('../middleware/auth');
router.get('/', auth, requireRole('admin'), userController.getAllUsers);
router.get('/pending', auth, requireRole('admin'), userController.getPendingManagers);
router.patch('/:id/approve', auth, requireRole('admin'), userController.approveManager);
router.delete('/:id', auth, requireRole('admin'), userController.deleteUser);

// User profile routes
router.get('/profile', auth, userController.getProfile);
router.patch('/profile', auth, userController.updateProfile);

module.exports = router;