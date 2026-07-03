import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CookieSettings from '@/lib/db/models/CookieSettings';
import CookieConsentRecord from '@/lib/db/models/CookieConsentRecord';

// GET - Retrieve cookie consent settings and statistics
export async function GET() {
    try {
        await dbConnect();

        // Get settings (or create default if not exists)
        let settings = await CookieSettings.findOne();
        if (!settings) {
            settings = await CookieSettings.create({
                enabled: true,
                necessaryOnly: false,
                analytics: true,
                marketing: false,
                position: 'bottom',
                expiration: 365,
                lastUpdated: new Date()
            });
        }

        // Calculate statistics from the database
        const totalConsents = await CookieConsentRecord.countDocuments();
        const analyticsOptIns = await CookieConsentRecord.countDocuments({ 'categories.analytics': true });
        const marketingOptIns = await CookieConsentRecord.countDocuments({ 'categories.marketing': true });

        const optInCount = await CookieConsentRecord.countDocuments({
            $or: [
                { 'categories.analytics': true },
                { 'categories.marketing': true }
            ]
        });

        const acceptanceRate = totalConsents > 0
            ? Math.round((optInCount / totalConsents) * 100)
            : 0;

        return NextResponse.json({
            settings,
            statistics: {
                totalConsents,
                analyticsOptIns,
                marketingOptIns,
                acceptanceRate,
            }
        });
    } catch (error) {
        console.error('Error getting cookie consent data:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve data' },
            { status: 500 }
        );
    }
}

// POST - Update cookie consent settings (admin)
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        const settings = await CookieSettings.findOneAndUpdate(
            {}, // Update the first document found (should be only one)
            {
                ...body,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            settings
        });
    } catch (error) {
        console.error('Error saving cookie consent settings:', error);
        return NextResponse.json(
            { error: 'Failed to save settings' },
            { status: 500 }
        );
    }
}

// PUT - Record a new consent (from frontend)
export async function PUT(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        const record = await CookieConsentRecord.create({
            consentId: `consent_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            categories: {
                necessary: body.necessary ?? true,
                analytics: body.analytics ?? false,
                marketing: body.marketing ?? false,
                preferences: body.preferences ?? false,
            },
            userAgent: request.headers.get('user-agent') || undefined,
            timestamp: new Date()
        });

        return NextResponse.json({
            success: true,
            record
        });
    } catch (error) {
        console.error('Error recording consent:', error);
        return NextResponse.json(
            { error: 'Failed to record consent' },
            { status: 500 }
        );
    }
}

// DELETE - Reset all consent data (admin)
export async function DELETE() {
    try {
        await dbConnect();
        await CookieConsentRecord.deleteMany({});

        return NextResponse.json({
            success: true,
            message: 'All consent records have been reset'
        });
    } catch (error) {
        console.error('Error resetting consent data:', error);
        return NextResponse.json(
            { error: 'Failed to reset data' },
            { status: 500 }
        );
    }
}
