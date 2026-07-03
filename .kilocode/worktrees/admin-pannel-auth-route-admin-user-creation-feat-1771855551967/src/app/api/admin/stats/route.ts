import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Product from '@/lib/db/models/Product';
import Order from '@/lib/db/models/Order';
import { verifyAdminToken } from '@/lib/auth/adminAuth';
import { stripe } from '@/lib/stripe';

// GET /api/admin/stats - Get dashboard statistics
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

        // Get total counts
        const [totalUsers, totalProducts, totalOrders] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments()
        ]);

        // Calculate total revenue
        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Get Top Selling Products
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.name',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // Get monthly revenue for last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m', date: '$createdAt' }
                    },
                    sales: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get recent orders (last 10)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'email')
            .select('_id user totalAmount status createdAt')
            .lean();

        // Get Stripe Balance if available
        let stripeBalance = { available: 0, pending: 0 };
        try {
            if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_key_here')) {
                const balance = await stripe.balance.retrieve();
                stripeBalance = {
                    available: balance.available.reduce((acc, curr) => acc + curr.amount, 0) / 100,
                    pending: balance.pending.reduce((acc, curr) => acc + curr.amount, 0) / 100
                };
            }
        } catch (e) {
            console.warn('[Admin Stats] Stripe balance fetch skipped:', e);
        }

        return NextResponse.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            monthlyRevenue,
            recentOrders,
            stripeBalance,
            topProducts
        });
    } catch (error: unknown) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard statistics' },
            { status: 500 }
        );
    }
}
