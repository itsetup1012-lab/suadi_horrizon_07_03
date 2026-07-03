/**
 * Script to refresh products in MongoDB - delete and re-add
 * This fixes issues with products not loading properly
 * Run with: npx tsx scripts/refresh-products.ts
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/saudi_horizon';

// Product Schema matching the app's model
const productSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: String,
    price: { type: Number, required: true, default: 0 },
    image: String,
    description: String,
    specs: mongoose.Schema.Types.Mixed,
    compatibility: [String],
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    oemCode: String,
}, {
    timestamps: true,
    _id: false
});

async function refreshProducts() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Load products from JSON
        const productsPath = path.join(process.cwd(), 'products.json');
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

        console.log(`📦 Found ${productsData.length} products in products.json`);

        // Create model
        const Product = mongoose.model('Product', productSchema);

        // Step 1: Delete all existing products
        console.log('🗑️  Deleting existing products from MongoDB...');
        const deleted = await Product.deleteMany({});
        console.log(`   Deleted ${deleted.deletedCount} products`);

        // Step 2: Insert fresh products
        console.log('📥 Inserting fresh products...');
        const inserted = await Product.insertMany(productsData);
        console.log(`   Inserted ${inserted.length} products`);

        // Verify
        const count = await Product.countDocuments();
        console.log(`✅ Total products in MongoDB: ${count}`);

        console.log('\n🎉 Products refresh completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error refreshing products:', error);
        process.exit(1);
    }
}

refreshProducts();
