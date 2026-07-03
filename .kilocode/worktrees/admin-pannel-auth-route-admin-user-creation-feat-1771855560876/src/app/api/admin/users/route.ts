import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication and admin privileges
        const userPayload = await requireAuth(request);
        const user = await User.findById(userPayload.sub);

        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { message: 'Admin privileges required' },
                { status: 403 }
            );
        }

        // Get all users except the current admin
        const users = await User.find({ _id: { $ne: user._id } })
            .select('-email -password -refreshToken -oauthProvider -oauthId')
            .sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';

        if (errorMessage === 'Unauthorized') {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        console.error('Get users error:', error);
        return NextResponse.json(
            { message: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication and admin privileges
        const userPayload = await requireAuth(request);
        const user = await User.findById(userPayload.sub);

        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { message: 'Admin privileges required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { email, role } = body;

        // Validation
        if (!email || !role) {
            return NextResponse.json(
                { message: 'Email and role are required' },
                { status: 400 }
            );
        }

        if (!['user', 'admin'].includes(role)) {
            return NextResponse.json(
                { message: 'Invalid role. Must be 'user' or 'admin'' },
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
        const newUser = await User.create({
            email: email.toLowerCase(),
            role,
        });

        // Return user data without sensitive information
        return NextResponse.json({
            _id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
        }, { status: 201 });
    } catch (error: unknown) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { message: 'Failed to create user' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication and admin privileges
        const userPayload = await requireAuth(request);
        const user = await User.findById(userPayload.sub);

        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { message: 'Admin privileges required' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        // Don't allow deleting the current admin user
        if (userId === user._id.toString()) {
            return NextResponse.json(
                { message: 'Cannot delete your own account' },
                { status: 400 }
            );
        }

        // Find and delete user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'User deleted successfully',
        });
    } catch (error: unknown) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { message: 'Failed to delete user' },
            { status: 500 }
        );
    }
}import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication and admin privileges
        const userPayload = await requireAuth(request);
        const user = await User.findById(userPayload.sub);

        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { message: 'Admin privileges required' },
                { status: 403 }
            );
        }

        // Get all users except the current admin
        const users = await User.find({ _id: { $ne: user._id } })
            .select('-email -password -refreshToken -oauthProvider -oauthId')
            .sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';

        if (errorMessage === 'Unauthorized') {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        console.error('Get users error:', error);
        return NextResponse.json(
            { message: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication and admin privileges
        const userPayload = await requireAuth(request);
        const user = await User.findById(userPayload.sub);

        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { message: 'Admin privileges required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { email, role } = body;

        // Validation
        if (!email || !role) {
            return NextResponse.json(
                { message: 'Email and role are required' },
                { status: 400 }
            );
        }

        if (!['user', 'admin'].includes(role)) {
            return NextResponse.json(
                { message: 'Invalid role. Must be 'user' or 'admin'' },
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
        const newUser = await User.create({
            email: email.toLowerCase(),
            role,
        });

        // Return user data without sensitive information
        return NextResponse.json({
            _id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
        }, { status: 201 });
    } catch (error: unknown) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { message: 'Failed to create user' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication and admin privileges
        const userPayload = await requireAuth(request);
        const user = await User.findById(userPayload.sub);

        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { message: 'Admin privileges required' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        // Don't allow deleting the current admin user
        if (userId === user._id.toString()) {
            return NextResponse.json(
                { message: 'Cannot delete your own account' },
                { status: 400 }
            );
        }

        // Find and delete user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'User deleted successfully',
        });
    } catch (error: unknown) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { message: 'Failed to delete user' },
            { status: 500 }
        );
    }
}
