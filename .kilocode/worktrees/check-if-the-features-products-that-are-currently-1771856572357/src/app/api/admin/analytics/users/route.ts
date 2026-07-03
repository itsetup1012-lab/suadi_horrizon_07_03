import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

// GET /api/admin/analytics/users - Get user analytics
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

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        // New users over time
        const newUsersTrend = await User.aggregate([
            { $match: { createdAt: { $gte: ninetyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // User growth summary
        const [totalUsers, newUsers30Days, activeUsers30Days] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            User.countDocuments({ lastLoginAt: { $gte: thirtyDaysAgo } })
        ]);

        // Users by role
        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Users by status
        const usersByStatus = await User.aggregate([
            { $group: { _id: '$isActive', count: { $sum: 1 } } }
        ]);

        return NextResponse.json({
            totalUsers,
            newUsers30Days,
            activeUsers30Days,
            growthRate: totalUsers > 0 ? ((newUsers30Days / totalUsers) * 100).toFixed(2) : '0',
            newUsersTrend,
            usersByRole,
            usersByStatus
        });
    } catch (error: unknown) {
        console.error('Error fetching user analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user analytics' },
            { status: 500 }
        );
    }
}
