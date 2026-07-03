import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

// GET /api/users/payment-methods - Get all payment methods for the current user
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

        return NextResponse.json(dbUser.paymentMethods || []);
    } catch (error: unknown) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment methods' },
            { status: 500 }
        );
    }
}

// POST /api/users/payment-methods - Add a new payment method
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const user = await requireAuth(request);

        const body = await request.json();
        const { type, cardNumber, expiry, cvv, name, isDefault } = body;

        // Validate required fields
        if (!type || !cardNumber || !expiry || !name) {
            return NextResponse.json(
                { error: 'Card type, number, expiry, and name are required' },
                { status: 400 }
            );
        }

        // Get last 4 digits
        const last4 = cardNumber.slice(-4);

        const dbUser = await User.findById(user.sub);
        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If this is set as default, unset other defaults
        if (isDefault && dbUser.paymentMethods && dbUser.paymentMethods.length > 0) {
            dbUser.paymentMethods = dbUser.paymentMethods.map((pm: any) => ({
                ...pm.toObject(),
                isDefault: false
            }));
        }

        // Add new payment method
        const newPaymentMethod = {
            _id: new mongoose.Types.ObjectId(),
            type,
            last4,
            expiry,
            name,
            isDefault: isDefault || (dbUser.paymentMethods?.length === 0)
        };

        if (!dbUser.paymentMethods) {
            dbUser.paymentMethods = [];
        }
        dbUser.paymentMethods.push(newPaymentMethod);
        await dbUser.save();

        // Return without full card number
        return NextResponse.json(newPaymentMethod, { status: 201 });
    } catch (error: unknown) {
        console.error('Error adding payment method:', error);
        return NextResponse.json(
            { error: 'Failed to add payment method' },
            { status: 500 }
        );
    }
}
