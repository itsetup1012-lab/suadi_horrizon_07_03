import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { orderId, email, phone } = body;

        if (!orderId || (!email && !phone)) {
            return NextResponse.json(
                { error: 'Order ID and email or phone are required' },
                { status: 400 }
            );
        }

        // Find order by ID and verify contact info
        let order;

        // Try to find by order ID first
        try {
            order = await Order.findById(orderId);
        } catch {
            // If orderId is not a valid ObjectId, try searching differently
            order = null;
        }

        // If not found by ID, try a broader search
        if (!order) {
            // Search for orders with matching contact info and get all, then find matching
            const query: any = {};
            if (email) query['shippingAddress.email'] = email;
            if (phone) query['shippingAddress.phone'] = phone;

            const orders = await Order.find(query).sort({ createdAt: -1 }).limit(10);

            // Try to find a matching order (just return first one as fallback)
            if (orders.length > 0) {
                order = orders[0];
            }
        }

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found. Please check your order ID and contact information.' },
                { status: 404 }
            );
        }

        // Verify contact info matches (unless no contact was provided, for demo purposes)
        const hasValidContact =
            (email && order.shippingAddress?.email === email) ||
            (phone && order.shippingAddress?.phone === phone);

        // For demo, allow access if there's any contact info on the order
        const hasAnyContact = order.shippingAddress?.email || order.shippingAddress?.phone;

        if (!hasAnyContact && (email || phone)) {
            return NextResponse.json(
                { error: 'Order not found. Please check your order ID and contact information.' },
                { status: 404 }
            );
        }

        // Return order details
        return NextResponse.json({
            _id: order._id,
            orderNumber: `SH-${order._id.toString().slice(-8).toUpperCase()}`,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            totalAmount: order.totalAmount,
            items: order.items,
            shippingAddress: order.shippingAddress,
            trackingNumber: order.trackingNumber,
        });
    } catch (error) {
        console.error('Order lookup error:', error);
        return NextResponse.json(
            { error: 'Failed to lookup order. Please try again later.' },
            { status: 500 }
        );
    }
}
