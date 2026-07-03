// Script to replace MongoDB products with JSON products
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/saudi_horizon';

async function replaceProducts() {
    console.log('🔄 Replacing MongoDB products with JSON products...\n');

    // Read JSON products
    const productsPath = path.join(process.cwd(), 'products.json');
    const jsonData = fs.readFileSync(productsPath, 'utf-8');
    const jsonProducts = JSON.parse(jsonData);
    console.log(`📦 Loaded ${jsonProducts.length} products from JSON`);

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db();
        const productsCollection = db.collection('products');

        // Delete existing products
        const deleted = await productsCollection.deleteMany({});
        console.log(`🗑️  Deleted ${deleted.deletedCount} existing products`);

        // Add JSON products with proper _id
        const productsToInsert = jsonProducts.map((p, index) => ({
            ...p,
            _id: p._id || new require('mongodb').ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date(),
            stock: p.stock || 100,
            rating: p.rating || 4.5,
            reviews: p.reviews || 0
        }));

        const inserted = await productsCollection.insertMany(productsToInsert);
        console.log(`✅ Inserted ${inserted.insertedCount} products`);

        // Verify
        const count = await productsCollection.countDocuments();
        const withPrice = await productsCollection.countDocuments({ price: { $gt: 0 } });
        console.log(`📊 Total products: ${count}, with valid prices: ${withPrice}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

replaceProducts();
