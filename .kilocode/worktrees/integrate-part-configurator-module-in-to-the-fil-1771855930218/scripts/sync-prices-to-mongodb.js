// Script to sync products from JSON to MongoDB with valid prices
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/saudi_horizon';

async function syncPrices() {
    console.log('🔄 Starting price sync from JSON to MongoDB...\n');

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

        // Count existing products
        const existingCount = await productsCollection.countDocuments();
        console.log(`📊 Existing products in MongoDB: ${existingCount}`);

        if (existingCount === 0) {
            console.log('❌ No products in MongoDB to update');
            return;
        }

        // Get all products from MongoDB
        const mongoProducts = await productsCollection.find({}).toArray();

        let updatedCount = 0;

        // Update each MongoDB product with price from JSON based on SKU
        for (const mongoProduct of mongoProducts) {
            // Find matching product in JSON by SKU
            const jsonProduct = jsonProducts.find(jp =>
                jp.sku === mongoProduct.sku ||
                jp.sku?.replace(/\s/g, '') === mongoProduct.sku?.replace(/\s/g, '')
            );

            if (jsonProduct && jsonProduct.price > 0 && mongoProduct.price === 0) {
                // Update the price
                await productsCollection.updateOne(
                    { _id: mongoProduct._id },
                    {
                        $set: {
                            price: jsonProduct.price,
                            comparePrice: jsonProduct.comparePrice || jsonProduct.price * 1.2
                        }
                    }
                );
                updatedCount++;
            }
        }

        console.log(`\n✅ Updated ${updatedCount} products with valid prices`);

        // Verify the update
        const productsWithPrice = await productsCollection.countDocuments({ price: { $gt: 0 } });
        console.log(`📊 Products with valid prices: ${productsWithPrice}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

syncPrices();
