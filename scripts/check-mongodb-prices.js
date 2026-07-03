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

        const count = await Product.countDocuments();
        console.log(`Total products in MongoDB: ${count}`);

        const productsWithPrice = await Product.find({ price: { $gt: 0 } }).limit(5);
        console.log(`Products with price > 0: ${productsWithPrice.length}`);

        if (productsWithPrice.length === 0) {
            const anyProducts = await Product.find().limit(5);
            console.log('Sample products (first 5):');
            anyProducts.forEach(p => {
                console.log(`ID: ${p._id}, Name: ${p.name}, Price: ${p.price}`);
            });
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkPrices();
