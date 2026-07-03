import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

// PUT /api/users/addresses/[id] - Update an address
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const user = await requireAuth(request);
        const { id } = await params;

        const body = await request.json();
        const { name, fullName, address, city, state, zipCode, country, phone, isDefault } = body;

        const dbUser = await User.findById(user.sub);
        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (!dbUser.addresses) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        const addressIndex = dbUser.addresses.findIndex((addr: any) => addr._id.toString() === id);
        if (addressIndex === -1) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        // If setting as default, unset other defaults first
        if (isDefault) {
            dbUser.addresses = dbUser.addresses.map((addr: any) => ({
                ...addr.toObject(),
                isDefault: false
            }));
        }

        // Update address
        const currentAddr = dbUser.addresses[addressIndex] as any;
        dbUser.addresses[addressIndex] = {
            _id: currentAddr._id,
            name: name || currentAddr.name,
            fullName: fullName || currentAddr.fullName,
            address: address || currentAddr.address,
            city: city || currentAddr.city,
            state: state || currentAddr.state,
            zipCode: zipCode || currentAddr.zipCode,
            country: country || currentAddr.country,
            phone: phone || currentAddr.phone,
            isDefault: isDefault !== undefined ? isDefault : currentAddr.isDefault
        };

        await dbUser.save();

        return NextResponse.json(dbUser.addresses[addressIndex]);
    } catch (error: unknown) {
        console.error('Error updating address:', error);
        return NextResponse.json(
            { error: 'Failed to update address' },
            { status: 500 }
        );
    }
}

// DELETE /api/users/addresses/[id] - Delete an address
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

        if (!dbUser.addresses || dbUser.addresses.length === 0) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        const addressExists = dbUser.addresses.some((addr: any) => addr._id.toString() === id);
        if (!addressExists) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        // Remove address
        dbUser.addresses = dbUser.addresses.filter((addr: any) => addr._id.toString() !== id);

        // If deleted address was default, set first remaining as default
        if (dbUser.addresses.length > 0 && !dbUser.addresses.some((addr: any) => addr.isDefault)) {
            (dbUser.addresses[0] as any).isDefault = true;
        }

        await dbUser.save();

        return NextResponse.json({ message: 'Address deleted successfully' });
    } catch (error: unknown) {
        console.error('Error deleting address:', error);
        return NextResponse.json(
            { error: 'Failed to delete address' },
            { status: 500 }
        );
    }
}
