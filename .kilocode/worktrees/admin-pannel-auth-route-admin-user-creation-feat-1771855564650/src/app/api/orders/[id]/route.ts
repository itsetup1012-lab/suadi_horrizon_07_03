import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await context.params;
        const order = await Order.findById(id).populate('items.product');

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error: unknown) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { message: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await context.params;
        const body = await request.json();
        const { status } = body;

        const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status' },
                { status: 400 }
            );
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error: unknown) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { message: 'Failed to update order' },
            { status: 500 }
        );
    }
}
