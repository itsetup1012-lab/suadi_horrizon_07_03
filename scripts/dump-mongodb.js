const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.DATABASE_URL;

async function dumpAll() {
    try {
        await mongoose.connect(MONGODB_URI);
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

        const products = await Product.find().select('name sku price createdAt');
        const dumpPath = path.join(process.cwd(), 'mongodb_dump.json');
        fs.writeFileSync(dumpPath, JSON.stringify(products, null, 2));

        console.log(`Dumped ${products.length} products to mongodb_dump.json`);
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

dumpAll();
