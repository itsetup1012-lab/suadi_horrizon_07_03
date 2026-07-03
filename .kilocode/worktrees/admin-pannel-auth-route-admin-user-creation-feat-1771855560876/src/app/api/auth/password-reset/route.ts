import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { generateAccessToken, verifyAccessToken } from '@/lib/auth/jwt';
import jwt from 'jsonwebtoken';

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
                { message: 'If the email exists, a password reset link has been sent' },
                { status: 200 }
            );
        }

        // Generate password reset token (for demo purposes, we'll use JWT)
        // In production, you'd store this in a separate collection with expiry
        const resetToken = generateAccessToken(user);

        // In a real implementation, you would:
        // 1. Store the reset token in a separate collection with expiry
        // 2. Send an email with the reset link
        // 3. Include the token in the reset link

        // For demo purposes, we'll return the token (this should be removed in production)
        return NextResponse.json({
            message: 'Password reset link has been sent to your email',
            resetToken: resetToken, // Remove this in production
        });
    } catch (error: unknown) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { message: 'Password reset failed' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { resetToken, newPassword } = body;

        // Validation
        if (!resetToken || !newPassword) {
            return NextResponse.json(
                { message: 'Reset token and new password are required' },
                { status: 400 }
            );
        }

        // Verify reset token
        let decoded;
        try {
            decoded = verifyAccessToken(resetToken);
        } catch (error) {
            return NextResponse.json(
                { message: 'Invalid or expired reset token' },
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

        // Update password
        user.password = newPassword;
        user.refreshToken = null; // Invalidate existing refresh token
        await user.save();

        return NextResponse.json({
            message: 'Password has been reset successfully',
        });
    } catch (error: unknown) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { message: 'Password reset failed' },
            { status: 500 }
        );
    }
}
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { generateAccessToken, verifyAccessToken } from '@/lib/auth/jwt';
import jwt from 'jsonwebtoken';

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
                { message: 'If the email exists, a password reset link has been sent' },
                { status: 200 }
            );
        }

        // Generate password reset token (for demo purposes, we'll use JWT)
        // In production, you'd store this in a separate collection with expiry
        const resetToken = generateAccessToken(user);

        // In a real implementation, you would:
        // 1. Store the reset token in a separate collection with expiry
        // 2. Send an email with the reset link
        // 3. Include the token in the reset link

        // For demo purposes, we'll return the token (this should be removed in production)
        return NextResponse.json({
            message: 'Password reset link has been sent to your email',
            resetToken: resetToken, // Remove this in production
        });
    } catch (error: unknown) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { message: 'Password reset failed' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { resetToken, newPassword } = body;

        // Validation
        if (!resetToken || !newPassword) {
            return NextResponse.json(
                { message: 'Reset token and new password are required' },
                { status: 400 }
            );
        }

        // Verify reset token
        let decoded;
        try {
            decoded = verifyAccessToken(resetToken);
        } catch (error) {
            return NextResponse.json(
                { message: 'Invalid or expired reset token' },
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

        // Update password
        user.password = newPassword;
        user.refreshToken = null; // Invalidate existing refresh token
        await user.save();

        return NextResponse.json({
            message: 'Password has been reset successfully',
        });
    } catch (error: unknown) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { message: 'Password reset failed' },
            { status: 500 }
        );
    }
}
import { generateAccessToken } from '@/lib/auth/jwt';

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
                { message: 'If the email exists, a password reset link has been sent' },
                { status: 200 }
            );
        }

        // Generate password reset token (for demo purposes, we'll use JWT)
        // In production, you'd store this in a separate collection with expiry
        const resetToken = generateAccessToken(user);

        // In a real implementation, you would:
        // 1. Store the reset token in a separate collection with expiry
        // 2. Send an email with the reset link
        // 3. Include the token in the reset link

        // For demo purposes, we'll return the token (this should be removed in production)
        return NextResponse.json({
            message: 'Password reset link has been sent to your email',
            resetToken: resetToken, // Remove this in production
        });
    } catch (error: unknown) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { message: 'Password reset failed' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { resetToken, newPassword } = body;

        // Validation
        if (!resetToken || !newPassword) {
            return NextResponse.json(
                { message: 'Reset token and new password are required' },
                { status: 400 }
            );
        }

        // Verify reset token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET || '') as any;
        } catch (error) {
            return NextResponse.json(
                { message: 'Invalid or expired reset token' },
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

        // Update password
        user.password = newPassword;
        user.refreshToken = null; // Invalidate existing refresh token
        await user.save();

        return NextResponse.json({
            message: 'Password has been reset successfully',
        });
    } catch (error: unknown) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { message: 'Password reset failed' },
            { status: 500 }
        );
    }
}
