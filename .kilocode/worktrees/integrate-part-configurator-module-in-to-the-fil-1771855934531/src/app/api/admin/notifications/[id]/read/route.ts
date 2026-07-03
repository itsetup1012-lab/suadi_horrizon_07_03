import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Notification from '@/lib/db/models/Notification';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

// PATCH /api/admin/notifications/[id]/read - Mark notification as read
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
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

        const { id } = await context.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return NextResponse.json(
                { error: 'Notification not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(notification);
    } catch (error: unknown) {
        console.error('Error marking notification as read:', error);
        return NextResponse.json(
            { error: 'Failed to mark notification as read' },
            { status: 500 }
        );
    }
}
