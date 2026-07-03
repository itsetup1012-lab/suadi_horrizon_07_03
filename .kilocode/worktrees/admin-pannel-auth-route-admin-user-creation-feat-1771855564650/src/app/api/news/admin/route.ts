import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import News from '@/lib/db/models/News';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status'); // 'published', 'draft', 'all'

        // Build query
        const query: Record<string, unknown> = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } }
            ];
        }

        if (status && status !== 'all') {
            if (status === 'published') {
                query.isPublished = true;
            } else if (status === 'draft') {
                query.isPublished = false;
            }
        }

        const skip = (page - 1) * limit;

        const [articles, total] = await Promise.all([
            News.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            News.countDocuments(query)
        ]);

        return NextResponse.json({
            articles,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: unknown) {
        console.error('Error fetching news articles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news articles' },
            { status: 500 }
        );
    }
}
