import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication
        const userPayload = await requireAuth(request);

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        // Validation
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findById(userPayload.sub);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Update password
        user.password = newPassword;
        user.refreshToken = null; // Invalidate existing refresh token
        await user.save();

        return NextResponse.json({
            message: 'Password has been changed successfully',
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Password change failed';

        if (errorMessage === 'Unauthorized') {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        console.error('Password change error:', error);
        return NextResponse.json(
            { message: 'Password change failed' },
            { status: 500 }
        );
    }
}import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication
        const userPayload = await requireAuth(request);

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        // Validation
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findById(userPayload.sub);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Update password
        user.password = newPassword;
        user.refreshToken = null; // Invalidate existing refresh token
        await user.save();

        return NextResponse.json({
            message: 'Password has been changed successfully',
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Password change failed';

        if (errorMessage === 'Unauthorized') {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        console.error('Password change error:', error);
        return NextResponse.json(
            { message: 'Password change failed' },
            { status: 500 }
        );
    }
}
