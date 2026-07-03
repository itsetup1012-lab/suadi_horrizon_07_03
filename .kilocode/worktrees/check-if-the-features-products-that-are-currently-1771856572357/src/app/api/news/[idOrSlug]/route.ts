import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import News from '@/lib/db/models/News';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ idOrSlug: string }> }
) {
    try {
        await connectDB();

        const { idOrSlug } = await context.params;
        const isId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

        const query = isId ? { _id: idOrSlug } : { slug: idOrSlug };
        const news = await News.findOne({
            ...query,
            isPublished: true // Public can only see published
        });

        if (!news) {
            return NextResponse.json(
                { error: 'News article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(news);
    } catch (error: unknown) {
        console.error('Error fetching news article:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news article' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ idOrSlug: string }> }
) {
    try {
        await connectDB();

        const { idOrSlug } = await context.params;
        const body = await request.json();

        // Update publishedAt if publishing for the first time
        if (body.isPublished === true) {
            const current = await News.findById(idOrSlug);
            if (current && !current.isPublished) {
                body.publishedAt = new Date();
            }
        }

        const news = await News.findByIdAndUpdate(idOrSlug, body, { new: true });

        if (!news) {
            return NextResponse.json(
                { error: 'News article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(news);
    } catch (error: unknown) {
        console.error('Error updating news:', error);
        return NextResponse.json(
            { error: 'Failed to update news' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ idOrSlug: string }> }
) {
    try {
        await connectDB();

        const { idOrSlug } = await context.params;
        const news = await News.findByIdAndDelete(idOrSlug);

        if (!news) {
            return NextResponse.json(
                { error: 'News article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'News article deleted' });
    } catch (error: unknown) {
        console.error('Error deleting news:', error);
        return NextResponse.json(
            { error: 'Failed to delete news' },
            { status: 500 }
        );
    }
}
