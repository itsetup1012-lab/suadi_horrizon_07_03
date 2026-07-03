import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { refreshToken } = body;

        // Validation
        if (!refreshToken) {
            return NextResponse.json(
                { success: false, message: 'Refresh token is required' },
                { status: 401 }
            );
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.json(
                { success: false, message: 'Invalid refresh token' },
                { status: 403 }
            );
        }

        // Find user
        const user = await User.findById(decoded.sub);

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 403 }
            );
        }

        // Verify the refresh token matches the one stored in database
        if (user.refreshToken !== refreshToken) {
            return NextResponse.json(
                { success: false, message: 'Invalid refresh token' },
                { status: 403 }
            );
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Update refresh token in database
        user.refreshToken = newRefreshToken;
        await user.save();

        // Return new tokens
        return NextResponse.json({
            success: true,
            data: {
                _id: user._id,
                email: user.email,
                role: user.role,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error: unknown) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            { success: false, message: 'Token refresh failed' },
            { status: 500 }
        );
    }
}
