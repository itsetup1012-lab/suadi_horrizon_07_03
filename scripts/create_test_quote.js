const mongoose = require('mongoose');

async function createTestQuote() {
    try {
        await mongoose.connect('mongodb://localhost:27017/saudi_horizon');
        console.log('Connected to MongoDB');

        const quoteData = {
            contactPerson: 'PDF Test User',
            companyName: 'Test Construction Co',
            email: 'test@example.com',
            phone: '+966 50 000 0000',
            location: 'Riyadh',
            items: 'Engine Overhaul Kit x1\nHeavy Duty Radiator x2\nHydraulic Pump Seal Kit x5',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const Collection = mongoose.connection.collection('quotes');
        const result = await Collection.insertOne(quoteData);

        console.log(`Created test quote with ID: ${result.insertedId}`);
        process.exit(0);
    } catch (err) {
        console.error('Failed to create quote:', err);
        process.exit(1);
    }
}

createTestQuote();
