import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { message: 'Email or password is incorrect' },
                { status: 400 }
            );
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Email or password is incorrect' },
                { status: 400 }
            );
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token to database
        user.refreshToken = refreshToken;
        await user.save();

        // Return user data with tokens
        return NextResponse.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken,
        });
    } catch (error: unknown) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Authentication failed' },
            { status: 500 }
        );
    }
}
