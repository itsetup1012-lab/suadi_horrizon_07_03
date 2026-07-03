import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/users/addresses - Get all addresses for the current user
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

        return NextResponse.json(dbUser.addresses || []);
    } catch (error: unknown) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch addresses' },
            { status: 500 }
        );
    }
}

// POST /api/users/addresses - Add a new address
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const user = await requireAuth(request);

        const body = await request.json();
        const { name, fullName, address, city, state, zipCode, country, phone, isDefault } = body;

        // Validate required fields
        if (!name || !fullName || !address || !city || !state || !zipCode || !country || !phone) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const dbUser = await User.findById(user.sub);
        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If this is set as default, unset other defaults
        if (isDefault && dbUser.addresses && dbUser.addresses.length > 0) {
            dbUser.addresses = dbUser.addresses.map((addr: any) => ({
                ...addr.toObject(),
                isDefault: false
            }));
        }

        // Add new address
        const newAddress = {
            _id: new mongoose.Types.ObjectId(),
            name,
            fullName,
            address,
            city,
            state,
            zipCode,
            country,
            phone,
            isDefault: isDefault || (dbUser.addresses?.length === 0)
        };

        if (!dbUser.addresses) {
            dbUser.addresses = [];
        }
        dbUser.addresses.push(newAddress);
        await dbUser.save();

        return NextResponse.json(newAddress, { status: 201 });
    } catch (error: unknown) {
        console.error('Error adding address:', error);
        return NextResponse.json(
            { error: 'Failed to add address' },
            { status: 500 }
        );
    }
}
