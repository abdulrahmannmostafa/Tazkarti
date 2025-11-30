const mongoose = require('mongoose');
const Team = require('../models/Team');
require('dotenv').config();

const teams = [
  { name: 'Al Ahly', city: 'Cairo', founded: 1907 },
  { name: 'Zamalek', city: 'Cairo', founded: 1911 },
  { name: 'Pyramids FC', city: 'Cairo', founded: 2008 },
  { name: 'Ismaily', city: 'Ismailia', founded: 1921 },
  { name: 'Al Masry', city: 'Port Said', founded: 1920 },
  { name: 'Al Ittihad Alexandria', city: 'Alexandria', founded: 1914 },
  { name: 'Ceramica Cleopatra', city: 'Cairo', founded: 2006 },
  { name: 'Future FC', city: 'Cairo', founded: 2015 },
  { name: 'Ghazl El Mahalla', city: 'Mahalla', founded: 1936 },
  { name: 'El Gouna', city: 'Hurghada', founded: 2003 },
  { name: 'ENPPI', city: 'Cairo', founded: 1980 },
  { name: 'Smouha', city: 'Alexandria', founded: 1949 },
  { name: 'National Bank of Egypt SC', city: 'Cairo', founded: 1960 },
  { name: 'Pharco FC', city: 'Cairo', founded: 2009 },
  { name: 'ZED FC', city: 'Cairo', founded: 2021 },
  { name: 'Al Mokawloon', city: 'Cairo', founded: 1973 },
  { name: 'Talaea El Gaish', city: 'Cairo', founded: 1979 },
  { name: 'Haras El Hodood', city: 'Cairo', founded: 1976 }
];

async function seedTeams() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/epl-reservation');
    // Clear existing teams
    await Team.deleteMany({});
    console.log('Cleared existing teams');
    
    // Insert new teams
    await Team.insertMany(teams);
    // Display teams
    const allTeams = await Team.find().sort({ name: 1 });
    console.log('\nTeams in database:');
    allTeams.forEach((team, index) => {
      console.log(`${index + 1}. ${team.name} (${team.city}) - ID: ${team._id}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding teams:', error);
    process.exit(1);
  }
}

seedTeams();