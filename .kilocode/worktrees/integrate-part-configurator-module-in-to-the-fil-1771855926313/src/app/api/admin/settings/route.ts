import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import mongoose from 'mongoose';

// Define a flexible settings schema
const SettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

// GET /api/admin/settings - Get all settings
export async function GET() {
    try {
        await connectDB();
        const settings = await Settings.find();

        // Convert to key-value map
        const settingsMap: Record<string, any> = {};
        settings.forEach((s: any) => {
            settingsMap[s.key] = s.value;
        });

        return NextResponse.json({ settings: settingsMap });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// POST /api/admin/settings - Save settings (upsert by key)
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { section, data } = body;

        if (!section || !data) {
            return NextResponse.json({ error: 'Missing section or data' }, { status: 400 });
        }

        // Upsert the settings section
        await Settings.findOneAndUpdate(
            { key: section },
            { key: section, value: data, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, message: `${section} settings saved` });
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
