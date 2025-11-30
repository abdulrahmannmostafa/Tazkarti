const mongoose = require('mongoose');
const Stadium = require('../models/Stadium');
require('dotenv').config();

const stadiums = [
    {
        name: 'Cairo International Stadium',
        city: 'Cairo',
        vipRows: 10,
        seatsPerRow: 20
    },
    {
        name: 'Borg El Arab Stadium',
        city: 'Alexandria',
        vipRows: 12,
        seatsPerRow: 25
    },
    {
        name: 'Air Defense Stadium',
        city: 'Cairo',
        vipRows: 8,
        seatsPerRow: 15
    },
    {
        name: 'Alexandria Stadium',
        city: 'Alexandria',
        vipRows: 6,
        seatsPerRow: 12
    },
    {
        name: 'Ismailia Stadium',
        city: 'Ismailia',
        vipRows: 6,
        seatsPerRow: 15
    },
    {
        name: 'Suez Stadium',
        city: 'Suez',
        vipRows: 8,
        seatsPerRow: 12
    },
    {
        name: 'Port Said Stadium',
        city: 'Port Said',
        vipRows: 7,
        seatsPerRow: 15
    },
    {
        name: '30 June Stadium',
        city: 'Cairo',
        vipRows: 8,
        seatsPerRow: 18
    }
];

async function seedStadiums() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        // Clear existing stadiums
        await Stadium.deleteMany({});
        console.log('Cleared existing stadiums');

        // Insert new stadiums
        const insertedStadiums = await Stadium.insertMany(stadiums);
        // Display stadiums with IDs
        console.log('\nStadiums in database:');
        insertedStadiums.forEach((stadium, index) => {
            console.log(`${index + 1}. ${stadium.name} (${stadium.city})`);
            console.log(`   VIP: ${stadium.vipRows} rows × ${stadium.seatsPerRow} seats = ${stadium.vipRows * stadium.seatsPerRow} total`);
            console.log(`   ID: ${stadium._id}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding stadiums:', error);
        process.exit(1);
    }
}

seedStadiums();
