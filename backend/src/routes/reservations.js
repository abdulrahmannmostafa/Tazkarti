const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { auth, requireRole } = require('../middleware/auth');

// Fan routes
router.get('/my-reservations', auth, reservationController.getUserReservations);
router.post('/', auth, requireRole('fan'), reservationController.createReservation);
router.delete('/:id', auth, reservationController.cancelReservation);

module.exports = router;