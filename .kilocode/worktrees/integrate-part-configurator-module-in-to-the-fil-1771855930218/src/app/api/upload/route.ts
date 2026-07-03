import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Create upload directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const filename = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, filename);

        // Convert file to buffer and save
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.promises.writeFile(filePath, buffer);

        // Return public URL
        return NextResponse.json({
            url: `/uploads/${filename}`
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
    }
}
