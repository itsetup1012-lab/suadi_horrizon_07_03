import connectDB from './src/lib/db/mongodb.js';
import QuoteRequest from './src/lib/db/models/QuoteRequest.js';
import mongoose from 'mongoose';

async function checkQuotes() {
    try {
        await connectDB();
        console.log('Connected to DB');

        const lastQuotes = await QuoteRequest.find().sort({ createdAt: -1 }).limit(5);

        console.log('Last 5 Quotes:');
        lastQuotes.forEach((q, i) => {
            console.log(`${i + 1}. ID: ${q._id}, Company: ${q.companyName}, UserID: ${q.userId || 'MISSING'}, Status: ${q.status}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkQuotes();
