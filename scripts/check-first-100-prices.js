const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.DATABASE_URL;

async function checkPrices() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

        const products = await Product.find().limit(100);
        const productsWithPrice = products.filter(p => p.price > 0);

        console.log(`Total checked: ${products.length}`);
        console.log(`Products with price > 0: ${productsWithPrice.length}`);

        if (productsWithPrice.length === 0) {
            console.log('No products in the first 100 have prices > 0.');
        } else {
            console.log(`First product with price: ${productsWithPrice[0].name} (SAR ${productsWithPrice[0].price})`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkPrices();
