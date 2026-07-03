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

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Create new user
        const user = await User.create({
            email: email.toLowerCase(),
            password,
            role: 'user',
        });

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
        }, { status: 201 });
    } catch (error: unknown) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Registration failed' },
            { status: 500 }
        );
    }
}
