const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Match = require('../models/Match');

// Generate unique ticket number
function generateTicketNumber() {
  return 'TKT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Check for match conflicts
async function hasConflictingMatch(userId, matchDateTime) {
  const userReservations = await Reservation.find({
    user: userId,
    status: 'confirmed'
  }).populate('match');
  
  return userReservations.some(reservation => {
    const reservedMatchTime = new Date(reservation.match.dateTime);
    return reservedMatchTime.getTime() === new Date(matchDateTime).getTime();
  });
}

// Get user reservations
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ 
      user: req.userId 
    }).populate({
      path: 'match',
      populate: { path: 'stadium' }
    }).sort({ createdAt: -1 });
    
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create reservation
exports.createReservation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { matchId, seats, creditCardNumber, creditCardPin } = req.body;
    
    // Validate inputs
    if (!seats || seats.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'No seats selected' });
    }
    
    // Get match
    const match = await Match.findById(matchId).populate('stadium').session(session);
    if (!match) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Check if match is in the future
    if (new Date(match.dateTime) < new Date()) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Cannot reserve seats for past matches' });
    }
    
    // Check for conflicting matches
    const hasConflict = await hasConflictingMatch(req.userId, match.dateTime);
    if (hasConflict) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'You have a reservation for a match at the same time' });
    }
    
    // Validate seats are within stadium bounds
    for (const seat of seats) {
      if (seat.row < 1 || seat.row > match.stadium.vipRows ||
          seat.seatNumber < 1 || seat.seatNumber > match.stadium.seatsPerRow) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Invalid seat selection' });
      }
    }
    
    // Check if seats are already reserved (with lock)
    for (const seat of seats) {
      const existingReservation = await Reservation.findOne({
        match: matchId,
        status: 'confirmed',
        'seats.row': seat.row,
        'seats.seatNumber': seat.seatNumber
      }).session(session);
      
      if (existingReservation) {
        await session.abortTransaction();
        return res.status(400).json({ 
          message: `Seat Row ${seat.row}, Seat ${seat.seatNumber} is already reserved` 
        });
      }
    }
    
    // Create reservation
    const reservation = new Reservation({
      user: req.userId,
      match: matchId,
      seats,
      ticketNumber: generateTicketNumber(),
      creditCardLast4: creditCardNumber.slice(-4),
      status: 'confirmed'
    });
    
    await reservation.save({ session });
    await session.commitTransaction();
    
    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`match_${matchId}`).emit('seatReserved', { 
      matchId, 
      seats 
    });
    
    await reservation.populate({
      path: 'match',
      populate: { path: 'stadium' }
    });
    
    res.status(201).json(reservation);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

// Cancel reservation
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('match');
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    // Check ownership
    if (reservation.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Check if already cancelled
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Reservation already cancelled' });
    }
    
    // Check 3-day rule
    const matchDate = new Date(reservation.match.dateTime);
    const threeDaysBefore = new Date(matchDate);
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
    
    if (new Date() > threeDaysBefore) {
      return res.status(400).json({ 
        message: 'Cannot cancel reservation within 3 days of the match' 
      });
    }
    
    reservation.status = 'cancelled';
    await reservation.save();
    
    // Emit socket event
    const io = req.app.get('io');
    io.to(`match_${reservation.match._id}`).emit('seatCancelled', { 
      matchId: reservation.match._id, 
      seats: reservation.seats 
    });
    
    res.json({ message: 'Reservation cancelled successfully', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};