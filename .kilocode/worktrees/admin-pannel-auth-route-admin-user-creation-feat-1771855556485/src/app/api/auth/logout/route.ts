import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication
        const userPayload = await requireAuth(request);

        // Find user and clear refresh token
        const user = await User.findById(userPayload.sub);

        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        return NextResponse.json({
            message: 'User logged out successfully',
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Logout failed';

        if (errorMessage === 'Unauthorized') {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        console.error('Logout error:', error);
        return NextResponse.json(
            { message: 'Logout failed' },
            { status: 500 }
        );
    }
}
