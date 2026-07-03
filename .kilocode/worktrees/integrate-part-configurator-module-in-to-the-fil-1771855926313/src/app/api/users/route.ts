import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role');

        // Build query
        const query: Record<string, unknown> = {};

        if (search) {
            query.$or = [
                { 'profile.name': { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role && role !== 'all') {
            query.role = role;
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query)
        ]);

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: unknown) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { message: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, email, password, role } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields: name, email, password' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Create user using plain object
        const userData = {
            email,
            password,
            role: role || 'customer',
            profile: { name }
        };

        const user = await User.create(userData);

        // Return user without password
        const userResponse = {
            _id: user._id,
            email: user.email,
            role: user.role,
            profile: user.profile,
            createdAt: user.createdAt
        };

        return NextResponse.json(userResponse, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { message: 'Failed to create user' },
            { status: 500 }
        );
    }
}
