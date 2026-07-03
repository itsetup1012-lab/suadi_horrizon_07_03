import jwt from 'jsonwebtoken';
import { IUser } from '../db/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-key';

// Token expiry times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export interface TokenPayload {
    sub: string;
    email: string;
    role: string;
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(user: IUser): string {
    const payload: TokenPayload = {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(user: IUser): string {
    const payload: TokenPayload = {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
    };

    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
}

/**
 * Verify JWT access token
 */
export function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

/**
 * Verify JWT refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
}
