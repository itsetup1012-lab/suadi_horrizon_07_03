import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CookieConsentRecord from '@/lib/db/models/CookieConsentRecord';

export const dynamic = 'force-dynamic';

// GET - Export all consent records as CSV
export async function GET() {
    try {
        await dbConnect();

        const records = await CookieConsentRecord.find()
            .sort({ timestamp: -1 })
            .lean();

        // Build CSV
        const headers = ['Consent ID', 'Timestamp', 'Necessary', 'Analytics', 'Marketing', 'Preferences', 'User Agent'];
        const rows = records.map((r: any) => [
            r.consentId,
            new Date(r.timestamp).toISOString(),
            r.categories?.necessary ? 'Yes' : 'No',
            r.categories?.analytics ? 'Yes' : 'No',
            r.categories?.marketing ? 'Yes' : 'No',
            r.categories?.preferences ? 'Yes' : 'No',
            `"${(r.userAgent || 'Unknown').replace(/"/g, '""')}"`,
        ].join(','));

        const csv = [headers.join(','), ...rows].join('\n');

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="cookie-consent-audit-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('Error exporting consent records:', error);
        return NextResponse.json(
            { error: 'Failed to export records' },
            { status: 500 }
        );
    }
}
