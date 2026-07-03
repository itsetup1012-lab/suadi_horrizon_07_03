import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Notification from '@/lib/db/models/Notification';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

// GET /api/admin/notifications - Get notifications
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
        const unreadOnly = searchParams.get('unreadOnly');
        const limit = parseInt(searchParams.get('limit') || '50');

        const query: any = {};
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(query).sort({ createdAt: -1 }).limit(limit),
            Notification.countDocuments(query),
            Notification.countDocuments({ isRead: false })
        ]);

        return NextResponse.json({
            notifications,
            total,
            unreadCount
        });
    } catch (error: unknown) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}
