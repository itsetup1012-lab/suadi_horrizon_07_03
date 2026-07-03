import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function POST() {
    try {
        await connectDB();

        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            // Update role to admin just in case
            existingAdmin.role = 'admin';
            if (!existingAdmin.profile) {
                existingAdmin.profile = { name: 'Administrator' };
            } else if (!existingAdmin.profile.name) {
                existingAdmin.profile.name = 'Administrator';
            }
            await existingAdmin.save();
            return NextResponse.json({ message: 'Admin user updated', email: adminEmail });
        }

        // Create new admin user
        const newAdmin = new User({
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            profile: {
                name: 'Administrator',
            },
        });

        await newAdmin.save();

        return NextResponse.json({
            message: 'Admin user created successfully',
            email: adminEmail,
            password: adminPassword
        });

    } catch (error: any) {
        console.error('Error creating admin user:', error);
        return NextResponse.json({
            error: error.message || 'Failed to create admin user'
        }, { status: 500 });
    }
}
