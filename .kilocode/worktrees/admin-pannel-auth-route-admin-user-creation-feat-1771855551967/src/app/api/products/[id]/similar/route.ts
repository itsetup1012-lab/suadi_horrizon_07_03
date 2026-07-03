import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Get products from JSON file
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

        // Get all products from JSON
        const products = getProductsFromJSON();

        // Find the current product
        const currentProduct = products.find(p => p._id === id || p.sku === id);

        if (!currentProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Find similar products (same category, excluding current product)
        const similarProducts = products
            .filter(p => p._id !== id && p.category === currentProduct.category)
            .slice(0, 4);

        return NextResponse.json(similarProducts);
    } catch (error: unknown) {
        console.error('Error fetching similar products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch similar products' },
            { status: 500 }
        );
    }
}
