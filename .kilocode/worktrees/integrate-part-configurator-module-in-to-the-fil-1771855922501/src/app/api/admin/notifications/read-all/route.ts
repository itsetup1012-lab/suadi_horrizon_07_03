import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Notification from '@/lib/db/models/Notification';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

// PATCH /api/admin/notifications/read-all - Mark all notifications as read
export async function PATCH(request: NextRequest) {
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

        const result = await Notification.updateMany(
            { isRead: false },
            { isRead: true }
        );

        return NextResponse.json({
            message: 'All notifications marked as read',
            count: result.modifiedCount
        });
    } catch (error: unknown) {
        console.error('Error marking all notifications as read:', error);
        return NextResponse.json(
            { error: 'Failed to mark all notifications as read' },
            { status: 500 }
        );
    }
}
