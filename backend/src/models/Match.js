const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  homeTeam: {
    type: String,  
    required: true
  },
  awayTeam: {
    type: String,  
    required: true,
    validate: {
      validator: function(v) {
        return v !== this.homeTeam;
      },
      message: 'Away team must be different from home team'
    }
  },
  stadium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stadium',
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  mainReferee: {
    type: String,
    required: true
  },
  linesmen: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length === 2;
      },
      message: 'Must have exactly 2 linesmen'
    },
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);