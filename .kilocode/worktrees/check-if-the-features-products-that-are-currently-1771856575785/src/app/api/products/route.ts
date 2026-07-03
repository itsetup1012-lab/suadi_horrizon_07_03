import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import fs from 'fs';
import path from 'path';

// Fallback: Read products from JSON file if DB fails
function getProductsFromJSON(): any[] {
    try {
        const productsPath = path.join(process.cwd(), 'products.json');
        const data = fs.readFileSync(productsPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products.json:', error);
        return [];
    }
}

export async function GET(request: NextRequest) {
    let dbProducts = null;

    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');

        // Build query
        const query: any = {};

        if (category) {
            query.category = category;
        }
        if (brand) {
            query.brand = brand;
        }
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = parseFloat(priceMin);
            if (priceMax) query.price.$lte = parseFloat(priceMax);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;
        const products = await Product.find(query)
            .skip(skip)
            .limit(limit);
        const total = await Product.countDocuments(query);

        // Check if products have valid prices (not 0), otherwise fallback to JSON
        const hasValidPrices = products.some((p: any) => p.price > 0);

        if (!hasValidPrices || total === 0) {
            console.log('MongoDB products have no valid prices, will fall back to JSON');
            dbProducts = null;
        } else {
            console.log('✅ Using MongoDB products - hasValidPrices:', hasValidPrices, 'total:', total);
            return NextResponse.json(
                { products, total, _source: 'mongodb' },
                {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                        'X-Data-Source': 'mongodb'
                    }
                }
            );
        }
    } catch (error: unknown) {
        console.log('Error fetching from MongoDB, falling back to JSON:', error);
    }

    // Fallback to JSON if DB failed or had invalid prices
    if (!dbProducts) {

        // Fallback to JSON file
        let products = getProductsFromJSON();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');

        // Apply filters
        if (category) {
            products = products.filter(p => p.category === category);
        }
        if (brand) {
            products = products.filter(p => p.brand === brand);
        }
        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p =>
                p.name?.toLowerCase().includes(searchLower) ||
                p.description?.toLowerCase().includes(searchLower) ||
                p.sku?.toLowerCase().includes(searchLower)
            );
        }

        const total = products.length;
        const skip = (page - 1) * limit;
        products = products.slice(skip, skip + limit);

        return NextResponse.json(
            { products, total, _source: 'json' },
            { headers: { 'X-Data-Source': 'json' } }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const products = Array.isArray(body) ? body : [body];

        // Insert multiple products
        const inserted = await Product.insertMany(products, { ordered: false });

        return NextResponse.json({
            success: true,
            count: inserted.length,
            products: inserted
        });
    } catch (error: unknown) {
        console.error('Error creating products:', error);
        return NextResponse.json(
            { error: 'Failed to create products' },
            { status: 500 }
        );
    }
}
