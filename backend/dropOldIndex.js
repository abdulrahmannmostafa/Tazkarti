const mongoose = require('mongoose');
require('dotenv').config();

async function dropIndex() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('reservations');

        // Drop the old index
        try {
            await collection.dropIndex('match_1_seats.row_1_seats.seatNumber_1');
            console.log('✅ Old index dropped successfully!');
        } catch (error) {
            if (error.code === 27) {
                console.log('Index already doesn\'t exist, that\'s fine!');
            } else {
                throw error;
            }
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

dropIndex();
