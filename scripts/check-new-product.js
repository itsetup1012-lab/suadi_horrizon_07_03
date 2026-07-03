const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.DATABASE_URL;

async function checkProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

        const count = await Product.countDocuments();
        console.log(`Total products in MongoDB: ${count}`);

        const products = await Product.find({
            $or: [
                { name: /BW Hydraulic Pump Assembly/i },
                { sku: 'SHI-HYD-9921' }
            ]
        });

        console.log(`Found ${products.length} matching products:`);
        products.forEach(p => {
            console.log(JSON.stringify(p, null, 2));
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkProducts();
