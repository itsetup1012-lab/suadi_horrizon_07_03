const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.DATABASE_URL;

async function clearProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const productCollection = collections.find(c => c.name === 'products');

        if (productCollection) {
            const res = await mongoose.connection.db.collection('products').deleteMany({});
            console.log(`Successfully deleted ${res.deletedCount} products from MongoDB.`);
        } else {
            console.log('No "products" collection found.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error clearing products:', error);
    }
}

clearProducts();
