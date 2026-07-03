import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/users/profile - Get user profile
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const user = await requireAuth(request);

        const dbUser = await User.findById(user.sub);
        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Return user profile (excluding sensitive data)
        return NextResponse.json({
            email: dbUser.email,
            name: dbUser.profile?.name || '',
            phone: dbUser.profile?.phone || '',
            company: dbUser.profile?.company || '',
            role: dbUser.role,
            createdAt: dbUser.createdAt
        });
    } catch (error: unknown) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const user = await requireAuth(request);

        const body = await request.json();
        const { name, phone, company, currentPassword, newPassword } = body;

        const dbUser = await User.findById(user.sub);
        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If changing password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { error: 'Current password is required to set a new password' },
                    { status: 400 }
                );
            }

            const isMatch = await dbUser.comparePassword(currentPassword);
            if (!isMatch) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 400 }
                );
            }

            // Hash and set new password
            const salt = await bcrypt.genSalt(10);
            dbUser.password = await bcrypt.hash(newPassword, salt);
        }

        // Update profile
        if (!dbUser.profile) {
            dbUser.profile = { name: '', phone: '', company: '' };
        }

        if (name !== undefined) dbUser.profile.name = name;
        if (phone !== undefined) dbUser.profile.phone = phone;
        if (company !== undefined) dbUser.profile.company = company;

        await dbUser.save();

        return NextResponse.json({
            message: 'Profile updated successfully',
            email: dbUser.email,
            name: dbUser.profile.name,
            phone: dbUser.profile.phone,
            company: dbUser.profile.company
        });
    } catch (error: unknown) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
