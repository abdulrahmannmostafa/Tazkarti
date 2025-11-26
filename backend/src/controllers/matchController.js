const Match = require('../models/Match');
const Reservation = require('../models/Reservation');
const Stadium = require('../models/Stadium');

// Get all matches
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('stadium')
      .sort({ dateTime: 1 });
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get match by ID with seat availability
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('stadium');
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Get reserved seats
    const reservations = await Reservation.find({ 
      match: req.params.id, 
      status: 'confirmed' 
    });
    
    const reservedSeats = [];
    reservations.forEach(reservation => {
      reservation.seats.forEach(seat => {
        reservedSeats.push(`${seat.row}-${seat.seatNumber}`);
      });
    });
    
    res.json({
      match,
      reservedSeats,
      totalSeats: match.stadium.vipRows * match.stadium.seatsPerRow,
      availableSeats: (match.stadium.vipRows * match.stadium.seatsPerRow) - reservedSeats.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create match (Manager only)
exports.createMatch = async (req, res) => {
  try {
    const { homeTeam, awayTeam, stadium, dateTime, mainReferee, linesmen } = req.body;
    
    // Validate input
    if (!homeTeam || !awayTeam || !stadium || !dateTime || !mainReferee || !linesmen) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (homeTeam === awayTeam) {
      return res.status(400).json({ message: 'Home team and away team must be different' });
    }
    
    if (!Array.isArray(linesmen) || linesmen.length !== 2) {
      return res.status(400).json({ message: 'Exactly 2 linesmen are required' });
    }
    
    // Verify stadium exists
    const stadiumExists = await Stadium.findById(stadium);
    if (!stadiumExists) {
      return res.status(404).json({ message: 'Stadium not found' });
    }
    
    // Check if match is in the future
    if (new Date(dateTime) < new Date()) {
      return res.status(400).json({ message: 'Match date must be in the future' });
    }
    
    const match = new Match({
      homeTeam,
      awayTeam,
      stadium,
      dateTime,
      mainReferee,
      linesmen
    });
    
    await match.save();
    await match.populate('stadium');
    
    res.status(201).json({
      message: 'Match created successfully',
      match
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update match (Manager only)
exports.updateMatch = async (req, res) => {
  try {
    const { homeTeam, awayTeam, stadium, dateTime, mainReferee, linesmen } = req.body;
    
    const updates = {};
    if (homeTeam) updates.homeTeam = homeTeam;
    if (awayTeam) updates.awayTeam = awayTeam;
    if (stadium) updates.stadium = stadium;
    if (dateTime) updates.dateTime = dateTime;
    if (mainReferee) updates.mainReferee = mainReferee;
    if (linesmen) updates.linesmen = linesmen;
    
    // Validate if both teams are being updated
    if (updates.homeTeam && updates.awayTeam && updates.homeTeam === updates.awayTeam) {
      return res.status(400).json({ message: 'Home team and away team must be different' });
    }
    
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('stadium');
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    res.json({
      message: 'Match updated successfully',
      match
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete match (Manager only)
exports.deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Cancel all reservations for this match
    await Reservation.updateMany(
      { match: req.params.id, status: 'confirmed' },
      { status: 'cancelled' }
    );
    
    res.json({ 
      message: 'Match deleted successfully. All reservations have been cancelled.',
      deletedMatch: match
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get match statistics (Manager only)
exports.getMatchStats = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('stadium');
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    const reservations = await Reservation.find({ 
      match: req.params.id, 
      status: 'confirmed' 
    }).populate('user', 'username firstName lastName email');
    
    const totalSeats = match.stadium.vipRows * match.stadium.seatsPerRow;
    const reservedSeatsCount = reservations.reduce((sum, r) => sum + r.seats.length, 0);
    
    // Create seat map
    const seatMap = [];
    for (let row = 1; row <= match.stadium.vipRows; row++) {
      for (let seat = 1; seat <= match.stadium.seatsPerRow; seat++) {
        const isReserved = reservations.some(r => 
          r.seats.some(s => s.row === row && s.seatNumber === seat)
        );
        seatMap.push({ row, seat, status: isReserved ? 'reserved' : 'vacant' });
      }
    }
    
    res.json({
      match,
      statistics: {
        totalSeats,
        reservedSeats: reservedSeatsCount,
        vacantSeats: totalSeats - reservedSeatsCount,
        occupancyRate: ((reservedSeatsCount / totalSeats) * 100).toFixed(2) + '%'
      },
      reservations: reservations.map(r => ({
        ticketNumber: r.ticketNumber,
        user: r.user,
        seats: r.seats,
        createdAt: r.createdAt
      })),
      seatMap
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};