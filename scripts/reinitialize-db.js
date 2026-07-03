const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.DATABASE_URL;

async function reinitializeDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;

        const collections = ['products', 'brands', 'categories'];

        for (const collectionName of collections) {
            try {
                const collection = db.collection(collectionName);
                const count = await collection.countDocuments();
                console.log(`Dropping collection "${collectionName}" (contained ${count} documents)...`);
                await collection.drop();
                console.log(`✓ Collection "${collectionName}" dropped successfully.`);
            } catch (err) {
                if (err.message === 'ns not found') {
                    console.log(`- Collection "${collectionName}" does not exist, skipping.`);
                } else {
                    console.error(`! Error dropping "${collectionName}":`, err.message);
                }
            }
        }

        console.log('\n✓ Database reinitialization complete (Products, Brands, and Categories cleared).');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Fatal Error during reinitialization:', error);
        process.exit(1);
    }
}

reinitializeDB();
