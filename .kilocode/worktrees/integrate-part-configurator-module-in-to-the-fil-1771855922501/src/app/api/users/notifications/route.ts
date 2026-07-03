import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/users/notifications - Get notification preferences
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const user = await requireAuth(request);

        const dbUser = await User.findById(user.sub);
        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(dbUser.notificationPreferences || {
            orderUpdates: true,
            promotionalEmails: false,
            smsNotifications: true,
            pushNotifications: true,
            newsletter: false,
            newProducts: true,
            priceAlerts: true
        });
    } catch (error: unknown) {
        console.error('Error fetching notification preferences:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notification preferences' },
            { status: 500 }
        );
    }
}

// PUT /api/users/notifications - Update notification preferences
export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const user = await requireAuth(request);

        const body = await request.json();
        const {
            orderUpdates,
            promotionalEmails,
            smsNotifications,
            pushNotifications,
            newsletter,
            newProducts,
            priceAlerts
        } = body;

        const dbUser = await User.findById(user.sub);
        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update notification preferences
        dbUser.notificationPreferences = {
            orderUpdates: orderUpdates !== undefined ? orderUpdates : dbUser.notificationPreferences?.orderUpdates ?? true,
            promotionalEmails: promotionalEmails !== undefined ? promotionalEmails : dbUser.notificationPreferences?.promotionalEmails ?? false,
            smsNotifications: smsNotifications !== undefined ? smsNotifications : dbUser.notificationPreferences?.smsNotifications ?? true,
            pushNotifications: pushNotifications !== undefined ? pushNotifications : dbUser.notificationPreferences?.pushNotifications ?? true,
            newsletter: newsletter !== undefined ? newsletter : dbUser.notificationPreferences?.newsletter ?? false,
            newProducts: newProducts !== undefined ? newProducts : dbUser.notificationPreferences?.newProducts ?? true,
            priceAlerts: priceAlerts !== undefined ? priceAlerts : dbUser.notificationPreferences?.priceAlerts ?? true
        };

        await dbUser.save();

        return NextResponse.json(dbUser.notificationPreferences);
    } catch (error: unknown) {
        console.error('Error updating notification preferences:', error);
        return NextResponse.json(
            { error: 'Failed to update notification preferences' },
            { status: 500 }
        );
    }
}
