const Team = require('../models/Team');
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.createTeam = async (req, res) => {
  try {
    const { name, city, stadium, founded, logo } = req.body;
    
    const team = new Team({
      name,
      city,
      stadium,
      founded,
      logo
    });
    
    await team.save();
    
    res.status(201).json({
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Team name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.updateTeam = async (req, res) => {
  try {
    const { name, city, stadium, founded, logo } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (city) updates.city = city;
    if (stadium) updates.stadium = stadium;
    if (founded) updates.founded = founded;
    if (logo) updates.logo = logo;
    
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    res.json({
      message: 'Team updated successfully',
      team
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Team name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    res.json({ 
      message: 'Team deleted successfully',
      deletedTeam: team
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};