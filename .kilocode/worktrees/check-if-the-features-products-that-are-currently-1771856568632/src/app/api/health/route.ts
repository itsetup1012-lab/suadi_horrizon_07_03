import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';

export async function GET() {
    try {
        // Test database connection
        await connectDB();

        return NextResponse.json({
            status: 'ok',
            message: 'Server is running',
            database: 'connected',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'Database connection failed',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
