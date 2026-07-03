import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import News from '@/lib/db/models/News';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const news = await News.find({ isPublished: true })
            .sort({ publishedAt: -1 });

        return NextResponse.json(news);
    } catch (error: unknown) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { title, content, excerpt, image, category, author, isPublished } = body;

        // Simple slug generation
        const slug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const news = await News.create({
            title,
            slug,
            content,
            excerpt,
            image,
            category,
            author,
            isPublished: isPublished ?? false,
            publishedAt: isPublished ? new Date() : undefined
        });

        return NextResponse.json(news, { status: 201 });
    } catch (error: any) {
        console.error('Error creating news:', error);
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Slug already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create news' },
            { status: 500 }
        );
    }
}
