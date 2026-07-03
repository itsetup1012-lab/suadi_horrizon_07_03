import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';

export async function GET() {
    try {
        // Pre-connect to database by making a quick connection test
        await connectDB();
        return NextResponse.json({
            status: 'ok',
            message: 'Database connection warmed up'
        });
    } catch (error) {
        console.error('Database warmup failed:', error);
        return NextResponse.json(
            { status: 'error', message: 'Database warmup failed' },
            { status: 500 }
        );
    }
}
