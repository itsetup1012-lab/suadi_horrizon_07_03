import { NextRequest } from 'next/server';
import { verifyAccessToken, TokenPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
    user?: TokenPayload;
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Verify authentication token and return user payload
 */
export async function verifyAuth(request: NextRequest): Promise<TokenPayload | null> {
    try {
        const token = extractToken(request);

        if (!token) {
            return null;
        }

        const payload = verifyAccessToken(token);
        return payload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

/**
 * Middleware to require authentication
 * Returns user payload or throws 401 error
 */
export async function requireAuth(request: NextRequest): Promise<TokenPayload> {
    const user = await verifyAuth(request);

    if (!user) {
        throw new Error('Unauthorized');
    }

    return user;
}
