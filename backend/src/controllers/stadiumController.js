const Stadium = require('../models/Stadium');

// Get all stadiums
exports.getAllStadiums = async (req, res) => {
  try {
    const stadiums = await Stadium.find().sort({ name: 1 });
    res.json(stadiums);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get stadium by ID
exports.getStadiumById = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) {
      return res.status(404).json({ message: 'Stadium not found' });
    }
    res.json(stadium);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create stadium (Manager only)
exports.createStadium = async (req, res) => {
  try {
    const { name, city, vipRows, seatsPerRow } = req.body;
    
    // Validate input
    if (!name || !city || !vipRows || !seatsPerRow) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (vipRows < 1 || seatsPerRow < 1) {
      return res.status(400).json({ message: 'Rows and seats per row must be at least 1' });
    }
    
    const stadium = new Stadium({
      name,
      city,
      vipRows,
      seatsPerRow
    });
    
    await stadium.save();
    
    res.status(201).json({
      message: 'Stadium created successfully',
      stadium
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Stadium name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update stadium (Manager only)
exports.updateStadium = async (req, res) => {
  try {
    const { name, city, vipRows, seatsPerRow } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (city) updates.city = city;
    if (vipRows) updates.vipRows = vipRows;
    if (seatsPerRow) updates.seatsPerRow = seatsPerRow;
    
    const stadium = await Stadium.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!stadium) {
      return res.status(404).json({ message: 'Stadium not found' });
    }
    
    res.json({
      message: 'Stadium updated successfully',
      stadium
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Stadium name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete stadium (Manager only)
exports.deleteStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findByIdAndDelete(req.params.id);
    
    if (!stadium) {
      return res.status(404).json({ message: 'Stadium not found' });
    }
    
    res.json({ 
      message: 'Stadium deleted successfully',
      deletedStadium: stadium
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};