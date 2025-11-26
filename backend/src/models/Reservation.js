const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  seats: [{
    row: {
      type: Number,
      required: true
    },
    seatNumber: {
      type: Number,
      required: true
    }
  }],
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  creditCardLast4: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Compound index to ensure seat uniqueness per match
reservationSchema.index({ match: 1, 'seats.row': 1, 'seats.seatNumber': 1 }, { unique: true });

module.exports = mongoose.model('Reservation', reservationSchema);