/**
 * Script to populate MongoDB with products from products.json
 * Run with: node scripts/seed-products.js
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saudi-horizon';

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: String,
    sku: String,
    stock: { type: Number, default: 0 },
    image: String,
    images: [String],
    compatibility: [String],
    specifications: mongoose.Schema.Types.Mixed,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

async function seedProducts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Load products from JSON
        const productsPath = path.join(__dirname, 'products.json');
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

        console.log(`Found ${productsData.length} products in products.json`);

        // Create model
        const Product = mongoose.model('Product', productSchema);

        // Clear existing products
        const deleted = await Product.deleteMany({});
        console.log(`Deleted ${deleted.deletedCount} existing products`);

        // Insert new products
        const inserted = await Product.insertMany(productsData);
        console.log(`Inserted ${inserted.length} products`);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts();
