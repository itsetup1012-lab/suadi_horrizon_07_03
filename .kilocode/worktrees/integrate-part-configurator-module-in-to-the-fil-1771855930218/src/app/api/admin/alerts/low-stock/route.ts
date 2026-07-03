import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

// GET /api/admin/alerts/low-stock - Get products with low stock
export async function GET(request: NextRequest) {
    // Verify admin authentication
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
        return NextResponse.json(
            { error: authResult.error },
            { status: authResult.status }
        );
    }

    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const threshold = parseInt(searchParams.get('threshold') || '10');

        const products = await Product.find({ stock: { $lt: threshold } })
            .sort({ stock: 1 })
            .limit(50);

        return NextResponse.json({
            count: products.length,
            threshold,
            products
        });
    } catch (error: unknown) {
        console.error('Error fetching low stock alerts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch low stock alerts' },
            { status: 500 }
        );
    }
}
