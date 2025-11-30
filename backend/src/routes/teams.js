const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { auth, requireRole, requireApproval } = require('../middleware/auth');
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);

// Admin/Manager routes
router.post('/', auth, requireRole('admin', 'manager'), requireApproval, teamController.createTeam);
router.patch('/:id', auth, requireRole('admin', 'manager'), requireApproval, teamController.updateTeam);
router.delete('/:id', auth, requireRole('admin', 'manager'), requireApproval, teamController.deleteTeam);

module.exports = router;