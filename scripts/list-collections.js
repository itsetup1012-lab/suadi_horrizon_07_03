const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.DATABASE_URL;

async function listCollections() {
    try {
        await mongoose.connect(MONGODB_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:');
        collections.forEach(c => console.log(`- ${c.name}`));

        // Count in each collection
        for (const c of collections) {
            const count = await mongoose.connection.db.collection(c.name).countDocuments();
            console.log(`- ${c.name}: ${count} documents`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

listCollections();
