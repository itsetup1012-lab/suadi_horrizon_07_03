import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import Order from '@/lib/db/models/Order';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

// GET /api/admin/analytics/inventory - Get inventory analytics
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

        // Total inventory value
        const inventoryValue = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
                    totalProducts: { $sum: 1 },
                    totalStock: { $sum: '$stock' },
                    avgPrice: { $avg: '$price' }
                }
            }
        ]);

        // Low stock products
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
            .sort({ stock: 1 })
            .limit(10);

        // Out of stock products
        const outOfStockCount = await Product.countDocuments({ stock: 0 });

        // Slow-moving products (low sales in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const slowMovingProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' }
                }
            },
            { $match: { totalSold: { $lt: 5 } } },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    name: '$product.name',
                    stock: '$product.stock',
                    totalSold: 1
                }
            },
            { $sort: { stock: -1 } },
            { $limit: 10 }
        ]);

        // Category distribution
        const categoryDistribution = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$stock' } } },
            { $sort: { count: -1 } }
        ]);

        return NextResponse.json({
            summary: inventoryValue[0] || { totalValue: 0, totalProducts: 0, totalStock: 0, avgPrice: 0 },
            outOfStockCount,
            lowStockProducts,
            slowMovingProducts,
            categoryDistribution
        });
    } catch (error: unknown) {
        console.error('Error fetching inventory analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inventory analytics' },
            { status: 500 }
        );
    }
}
