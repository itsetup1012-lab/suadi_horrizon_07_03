import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { userId, items, totalAmount, shippingAddress } = body;

        // Validation
        if (!userId || !items || !totalAmount || !shippingAddress) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create order
        const order = await Order.create({
            user: userId,
            items,
            totalAmount,
            shippingAddress,
            status: 'pending'
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { message: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const admin = searchParams.get('admin');

        // If admin parameter is set, return all orders (for admin panel)
        if (admin === 'true' || admin === '1') {
            const orders = await Order.find()
                .populate('items.product')
                .populate('user', 'email name')
                .sort({ createdAt: -1 });

            return NextResponse.json({ orders });
        }

        // Regular user order fetch requires userId
        if (!userId) {
            return NextResponse.json(
                { message: 'userId is required for regular users' },
                { status: 400 }
            );
        }

        const orders = await Order.find({ user: userId })
            .populate('items.product')
            .sort({ createdAt: -1 });

        return NextResponse.json({ orders });
    } catch (error: unknown) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { message: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
