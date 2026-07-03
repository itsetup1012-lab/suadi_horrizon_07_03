import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import { verifyAdminToken } from '@/lib/auth/adminAuth';
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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Try to get from MongoDB first
        try {
            await connectDB();
            const product = await Product.findById(id);

            if (product) {
                // Check if product has valid price
                if (product.price > 0) {
                    return NextResponse.json(product);
                }
            }
        } catch (dbError) {
            console.log('MongoDB error, falling back to JSON:', dbError);
        }

        // Fallback to JSON file
        const products = getProductsFromJSON();
        const product = products.find(p => p._id === id || p.sku === id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error: unknown) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PATCH /api/products/[id] - Update product (stock, price, name, etc.)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
        return NextResponse.json(
            { error: authResult.error },
            { status: authResult.status }
        );
    }

    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        // Only allow certain fields to be updated
        const allowedFields = ['name', 'sku', 'price', 'stock', 'category', 'image', 'isActive', 'description'];
        const updateData: Record<string, any> = {};
        for (const key of allowedFields) {
            if (body[key] !== undefined) {
                updateData[key] = body[key];
            }
        }

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error: unknown) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// PUT /api/products/[id] - Full update product (alias for PATCH)
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    return PATCH(request, context);
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
        return NextResponse.json(
            { error: authResult.error },
            { status: authResult.status }
        );
    }

    try {
        await connectDB();
        const { id } = await params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Product deleted successfully', product });
    } catch (error: unknown) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
