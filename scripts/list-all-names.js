const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.DATABASE_URL;

async function listAll() {
    try {
        await mongoose.connect(MONGODB_URI);
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

        const products = await Product.find().select('name sku');
        console.log(`Listing ${products.length} products:`);
        products.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name} [${p.sku}]`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

listAll();
