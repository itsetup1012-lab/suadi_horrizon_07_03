import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { public_id } = body;

        if (!public_id) {
            return NextResponse.json({ error: 'No public_id provided' }, { status: 400 });
        }

        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === 'ok') {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }
}
