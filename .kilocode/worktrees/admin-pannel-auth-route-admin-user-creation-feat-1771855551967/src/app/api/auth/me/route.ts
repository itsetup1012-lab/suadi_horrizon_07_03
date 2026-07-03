import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication
        const userPayload = await requireAuth(request);

        // Find user
        const user = await User.findById(userPayload.sub).select('-password -refreshToken');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';

        if (errorMessage === 'Unauthorized') {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        console.error('Get user error:', error);
        return NextResponse.json(
            { message: 'Failed to fetch user profile' },
            { status: 500 }
        );
    }
}
