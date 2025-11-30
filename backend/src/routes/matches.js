const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { auth, requireRole, requireApproval } = require('../middleware/auth');
router.get('/', matchController.getAllMatches);
router.get('/:id', matchController.getMatchById);
router.get('/:id/seats', matchController.getMatchSeats);
router.post('/', auth, requireRole('manager'), requireApproval, matchController.createMatch);
router.patch('/:id', auth, requireRole('manager'), requireApproval, matchController.updateMatch);
router.delete('/:id', auth, requireRole('manager'), requireApproval, matchController.deleteMatch);
router.get('/:id/stats', auth, requireRole('manager'), requireApproval, matchController.getMatchStats);

module.exports = router;