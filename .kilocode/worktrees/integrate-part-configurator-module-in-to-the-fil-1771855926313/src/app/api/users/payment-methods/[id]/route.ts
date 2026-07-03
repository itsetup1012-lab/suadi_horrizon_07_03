import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

// DELETE /api/users/payment-methods/[id] - Delete a payment method
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const { id } = await params;

        const dbUser = await User.findById(user.sub);
        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (!dbUser.paymentMethods || dbUser.paymentMethods.length === 0) {
            return NextResponse.json(
                { error: 'Payment method not found' },
                { status: 404 }
            );
        }

        const paymentMethodExists = dbUser.paymentMethods.some((pm: any) => pm._id.toString() === id);
        if (!paymentMethodExists) {
            return NextResponse.json(
                { error: 'Payment method not found' },
                { status: 404 }
            );
        }

        // Remove payment method
        dbUser.paymentMethods = dbUser.paymentMethods.filter((pm: any) => pm._id.toString() !== id);

        // If deleted payment method was default, set first remaining as default
        if (dbUser.paymentMethods.length > 0 && !dbUser.paymentMethods.some((pm: any) => pm.isDefault)) {
            (dbUser.paymentMethods[0] as any).isDefault = true;
        }

        await dbUser.save();

        return NextResponse.json({ message: 'Payment method deleted successfully' });
    } catch (error: unknown) {
        console.error('Error deleting payment method:', error);
        return NextResponse.json(
            { error: 'Failed to delete payment method' },
            { status: 500 }
        );
    }
}
