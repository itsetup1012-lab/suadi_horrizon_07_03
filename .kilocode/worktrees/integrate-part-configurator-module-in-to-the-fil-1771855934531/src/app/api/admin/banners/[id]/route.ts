import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Banner from '@/lib/db/models/Banner';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

// PATCH /api/admin/banners/[id] - Update banner
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    // Verify admin authentication
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
        return NextResponse.json(
            { error: authResult.error },
            { status: authResult.status }
        );
    }

    try {
        await connectDB();

        const { id } = await context.params;
        const body = await request.json();

        const banner = await Banner.findByIdAndUpdate(id, body, { new: true });

        if (!banner) {
            return NextResponse.json(
                { error: 'Banner not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(banner);
    } catch (error: unknown) {
        console.error('Error updating banner:', error);
        return NextResponse.json(
            { error: 'Failed to update banner' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/banners/[id] - Delete banner
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    // Verify admin authentication
    const authResult = await verifyAdminToken(request);
    if (authResult.error) {
        return NextResponse.json(
            { error: authResult.error },
            { status: authResult.status }
        );
    }

    try {
        await connectDB();

        const { id } = await context.params;
        const banner = await Banner.findByIdAndDelete(id);

        if (!banner) {
            return NextResponse.json(
                { error: 'Banner not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Banner deleted successfully', banner });
    } catch (error: unknown) {
        console.error('Error deleting banner:', error);
        return NextResponse.json(
            { error: 'Failed to delete banner' },
            { status: 500 }
        );
    }
}
