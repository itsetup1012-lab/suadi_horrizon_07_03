import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/lib/db/models/User';
import connectDB from '@/lib/db/mongodb';

export async function verifyAdminToken(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { error: 'Access denied. No token provided.', status: 401 };
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;

        await connectDB();
        const user = await User.findById(decoded.sub);

        if (!user) {
            return { error: 'Invalid token. User not found.', status: 401 };
        }

        if (user.role !== 'admin') {
            return { error: 'Access denied. Admin privileges required.', status: 403 };
        }

        return { user, error: null };
    } catch (error: unknown) {
        console.error('Admin auth error:', error);
        return { error: 'Invalid token.', status: 401 };
    }
}
