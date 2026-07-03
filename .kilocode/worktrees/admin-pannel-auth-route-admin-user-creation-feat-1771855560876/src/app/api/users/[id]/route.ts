import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

// GET /api/users/[id] - Get a single user
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;

        const user = await User.findById(id).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

// PATCH /api/users/[id] - Update user role, status, or profile
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;
        const body = await request.json();

        // Build update object from allowed fields
        const allowedFields: Record<string, any> = {};

        if (body.role !== undefined) {
            const validRoles = ['user', 'admin', 'manager', 'customer'];
            if (!validRoles.includes(body.role)) {
                return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
            }
            allowedFields.role = body.role;
        }

        if (body.isActive !== undefined) {
            allowedFields.isActive = Boolean(body.isActive);
        }

        if (body.name !== undefined) {
            allowedFields['profile.name'] = body.name;
        }

        if (Object.keys(allowedFields).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: allowedFields },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user, message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await context.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
