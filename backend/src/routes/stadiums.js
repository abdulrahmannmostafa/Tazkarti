const express = require('express');
const router = express.Router();
const stadiumController = require('../controllers/stadiumController');
const { auth, requireRole, requireApproval } = require('../middleware/auth');
router.get('/', stadiumController.getAllStadiums);
router.get('/:id', stadiumController.getStadiumById);
router.post('/', auth, requireRole('manager'), requireApproval, stadiumController.createStadium);
router.patch('/:id', auth, requireRole('manager'), requireApproval, stadiumController.updateStadium);
router.delete('/:id', auth, requireRole('manager'), requireApproval, stadiumController.deleteStadium);

module.exports = router;