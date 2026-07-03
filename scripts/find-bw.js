const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.DATABASE_URL;

async function checkBW() {
    try {
        await mongoose.connect(MONGODB_URI);
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

        const products = await Product.find({
            $or: [
                { name: /BW/i },
                { sku: /BW/i },
                { name: /Hydraulic/i },
                { sku: /HYD/i }
            ]
        });

        console.log(`Found ${products.length} products:`);
        products.forEach(p => {
            console.log(`- ${p.name} [${p.sku}] Price: ${p.price} Created: ${p.createdAt}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkBW();
