/**
 * Migration Script v2
 * Purpose: Transition from flat JSON to Relational MongoDB Structure (Categories, Brands, Products)
 * Run with: node scripts/migrate-to-v2.js
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// MongoDB connection string
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/saudi_horizon';

// Models (Defined inline to avoid path issues with ESM/CJS)
const categorySchema = new Schema({
    _id: { type: String, required: true }, // We'll use slug-ified names as IDs
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const brandSchema = new Schema({
    _id: { type: String, required: true }, // We'll use names as IDs
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const productSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true, index: true },
    brand: { type: String, ref: 'Brand', required: true },
    category: { type: String, ref: 'Category', required: true },
    subcategory: { type: String, ref: 'Category' },
    price: { type: Number, required: true, default: 0 },
    image: {
        url: { type: String },
        public_id: { type: String }
    },
    gallery: [{
        url: { type: String },
        public_id: { type: String }
    }],
    description: String,
    specs: { type: Schema.Types.Mixed },
    compatibility: [String],
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    oemCode: String
}, { timestamps: true, _id: false });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Brand = mongoose.models.Brand || mongoose.model('Brand', brandSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

function slugify(text) {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')       // Remove all non-word chars
        .replace(/--+/g, '-');          // Replace multiple - with single -
}

async function migrate() {
    try {
        console.log('🚀 Starting Migration to v2 Architecture...');
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // 1. Load Data
        const productsPath = path.join(process.cwd(), 'products.json');
        const rawProducts = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        console.log(`✓ Loaded ${rawProducts.length} products from products.json`);

        // 2. Extract Unique Categories & Brands
        const categories = new Set();
        const subcategories = new Set();
        const brands = new Set();

        rawProducts.forEach(p => {
            if (p.category) categories.add(p.category.trim());
            if (p.subcategory && p.subcategory.trim()) subcategories.add(p.subcategory.trim());
            if (p.brand) brands.add(p.brand.trim());
        });

        console.log(`✓ Identified ${categories.size} categories, ${subcategories.size} subcategories, and ${brands.size} brands`);

        // 3. Clear Existing Data (Optional but recommended for fresh start)
        await Category.deleteMany({});
        await Brand.deleteMany({});
        await Product.deleteMany({});
        console.log('✓ Cleared existing Categories, Brands, and Products');

        // 4. Create Categories
        const catMap = {};
        for (const catName of categories) {
            const slug = slugify(catName);
            const cat = await Category.create({
                _id: slug,
                name: catName,
                slug: slug
            });
            catMap[catName] = cat._id;
        }

        // Handle subcategories separately if they aren't in main categories
        for (const subName of subcategories) {
            if (!catMap[subName]) {
                const slug = slugify(subName);
                const cat = await Category.create({
                    _id: slug,
                    name: subName,
                    slug: slug
                });
                catMap[subName] = cat._id;
            }
        }
        console.log('✓ Created Brand index and Category records');

        // 5. Create Brands
        const brandMap = {};
        for (const brandName of brands) {
            const slug = slugify(brandName);
            const b = await Brand.create({
                _id: slug,
                name: brandName,
                slug: slug
            });
            brandMap[brandName] = b._id;
        }
        console.log('✓ Created Brand records');

        // 6. Transform and Insert Products
        const transformedProducts = rawProducts.map(p => ({
            _id: p._id || p.sku,
            name: p.name,
            sku: p.sku,
            brand: brandMap[p.brand],
            category: catMap[p.category],
            subcategory: p.subcategory ? catMap[p.subcategory] : undefined,
            price: p.price || 0,
            image: {
                url: p.image || '',
                public_id: 'legacy_import' // Placeholder until Cloudinary upload happens
            },
            description: p.description,
            specs: p.specs,
            compatibility: p.compatibility,
            inStock: p.inStock,
            stock: p.stock || 0,
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            oemCode: p.oemCode
        }));

        const inserted = await Product.insertMany(transformedProducts);
        console.log(`✓ Successfully migrated ${inserted.length} products to the new structure!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
