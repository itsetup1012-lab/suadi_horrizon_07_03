import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { generateAccessToken, verifyAccessToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { message: 'Verification token is required' },
                { status: 400 }
            );
        }

        // Verify verification token
        let decoded;
        try {
            decoded = verifyAccessToken(token);
        } catch (error) {
            return NextResponse.json(
                { message: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findById(decoded.sub);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Mark email as verified
        user.emailVerified = true;
        await user.save();

        return NextResponse.json({
            message: 'Email has been successfully verified',
        });
    } catch (error: unknown) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { message: 'Email verification failed' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email } = body;

        // Validation
        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if email exists for security
            return NextResponse.json(
                { message: 'If the email exists, a verification link has been sent' },
                { status: 200 }
            );
        }

        // Generate verification token
        const verificationToken = generateAccessToken(user);

        // In a real implementation, you would:
        // 1. Store the verification token in a separate collection with expiry
        // 2. Send an email with the verification link
        // 3. Include the token in the verification link

        // For demo purposes, we'll return the token (this should be removed in production)
        return NextResponse.json({
            message: 'Verification link has been sent to your email',
            verificationToken: verificationToken, // Remove this in production
        });
    } catch (error: unknown) {
        console.error('Account recovery error:', error);
        return NextResponse.json(
            { message: 'Account recovery failed' },
            { status: 500 }
        );
    }
}import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { generateAccessToken, verifyAccessToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { message: 'Verification token is required' },
                { status: 400 }
            );
        }

        // Verify verification token
        let decoded;
        try {
            decoded = verifyAccessToken(token);
        } catch (error) {
            return NextResponse.json(
                { message: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findById(decoded.sub);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Mark email as verified
        user.emailVerified = true;
        await user.save();

        return NextResponse.json({
            message: 'Email has been successfully verified',
        });
    } catch (error: unknown) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { message: 'Email verification failed' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email } = body;

        // Validation
        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if email exists for security
            return NextResponse.json(
                { message: 'If the email exists, a verification link has been sent' },
                { status: 200 }
            );
        }

        // Generate verification token
        const verificationToken = generateAccessToken(user);

        // In a real implementation, you would:
        // 1. Store the verification token in a separate collection with expiry
        // 2. Send an email with the verification link
        // 3. Include the token in the verification link

        // For demo purposes, we'll return the token (this should be removed in production)
        return NextResponse.json({
            message: 'Verification link has been sent to your email',
            verificationToken: verificationToken, // Remove this in production
        });
    } catch (error: unknown) {
        console.error('Account recovery error:', error);
        return NextResponse.json(
            { message: 'Account recovery failed' },
            { status: 500 }
        );
    }
}
