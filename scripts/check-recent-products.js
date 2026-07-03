const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.DATABASE_URL;

async function checkRecent() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

        const products = await Product.find().sort({ createdAt: -1 }).limit(20);
        console.log(`Last 20 Products in MongoDB:`);
        products.forEach(p => {
            const id = p._id || p.id;
            console.log(`[${id}] SKU: ${p.sku}, Name: ${p.name}, CreatedAt: ${p.createdAt}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkRecent();
