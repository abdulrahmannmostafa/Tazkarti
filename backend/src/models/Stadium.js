const mongoose = require('mongoose');

const stadiumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  city: {
    type: String,
    required: true
  },
  vipRows: {
    type: Number,
    required: true,
    min: 1
  },
  seatsPerRow: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

stadiumSchema.virtual('totalSeats').get(function() {
  return this.vipRows * this.seatsPerRow;
});

module.exports = mongoose.model('Stadium', stadiumSchema);