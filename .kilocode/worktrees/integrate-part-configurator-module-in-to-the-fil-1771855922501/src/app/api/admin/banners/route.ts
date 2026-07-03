import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Banner from '@/lib/db/models/Banner';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

// GET /api/admin/banners - Get banners with filtering
export async function GET(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const active = searchParams.get('active');
        const position = searchParams.get('position');

        const query: any = {};
        if (active !== null) {
            query.isActive = active === 'true';
        }
        if (position) {
            query.position = position;
        }

        const banners = await Banner.find(query).sort({ createdAt: -1 });

        return NextResponse.json(banners);
    } catch (error: unknown) {
        console.error('Error fetching banners:', error);
        return NextResponse.json(
            { error: 'Failed to fetch banners' },
            { status: 500 }
        );
    }
}

// POST /api/admin/banners - Create new banner
export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { title, subtitle, image, link, ctaText, position, isActive, startDate, endDate } = body;

        if (!title || !position) {
            return NextResponse.json(
                { error: 'title and position are required' },
                { status: 400 }
            );
        }

        const newBanner = await Banner.create({
            title,
            subtitle: subtitle || '',
            image: image || '',
            link: link || '',
            ctaText: ctaText || 'Shop Now',
            position,
            isActive: isActive !== undefined ? isActive : true,
            startDate: startDate || undefined,
            endDate: endDate || undefined
        });

        return NextResponse.json(newBanner, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating banner:', error);
        return NextResponse.json(
            { error: 'Failed to create banner' },
            { status: 500 }
        );
    }
}
