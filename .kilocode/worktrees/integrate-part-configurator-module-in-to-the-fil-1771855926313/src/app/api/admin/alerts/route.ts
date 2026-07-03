import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/db/models/Product';
import Order from '@/lib/db/models/Order';
import User from '@/lib/db/models/User';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

// GET /api/admin/alerts - Get all alert counts
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [lowStockCount, pendingOrders, newUsersToday] = await Promise.all([
            Product.countDocuments({ stock: { $lt: 10 } }),
            Order.countDocuments({ status: 'pending' }),
            User.countDocuments({ createdAt: { $gte: today } })
        ]);

        return NextResponse.json({
            lowStockCount,
            pendingOrders,
            newUsersToday,
            totalAlerts: lowStockCount + pendingOrders
        });
    } catch (error: unknown) {
        console.error('Error fetching alerts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch alerts' },
            { status: 500 }
        );
    }
}
