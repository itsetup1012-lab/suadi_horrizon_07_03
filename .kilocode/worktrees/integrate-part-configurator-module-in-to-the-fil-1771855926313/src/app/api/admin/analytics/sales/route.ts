import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';
import Product from '@/lib/db/models/Product';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

// GET /api/admin/analytics/sales - Get sales analytics
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
        const period = searchParams.get('period') || '30days';

        const daysMap: Record<string, number> = {
            '7days': 7,
            '30days': 30,
            '90days': 90,
            'year': 365
        };
        const days = daysMap[period] || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Sales trend
        const salesTrend = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    sales: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top products
        const topProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    name: { $first: '$items.name' },
                    quantity: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 }
        ]);

        // Category breakdown
        const categoryBreakdown = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        // Summary stats
        const summary = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    avgOrderValue: { $avg: '$totalAmount' }
                }
            }
        ]);

        return NextResponse.json({
            period,
            summary: summary[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
            salesTrend,
            topProducts,
            categoryBreakdown
        });
    } catch (error: unknown) {
        console.error('Error fetching sales analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sales analytics' },
            { status: 500 }
        );
    }
}
