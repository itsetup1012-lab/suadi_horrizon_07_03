const mongoose = require('mongoose');

async function fixTypos() {
    try {
        await mongoose.connect('mongodb://localhost:27017/saudi_horizon');
        console.log('Connected to MongoDB');

        const collections = ['invoices', 'quotes'];

        for (const colName of collections) {
            const Collection = mongoose.connection.collection(colName);
            const cursor = Collection.find({ notes: /invoive/i });

            while (await cursor.hasNext()) {
                const doc = await cursor.next();
                const fixedNotes = doc.notes.replace(/invoive/gi, 'invoice');
                await Collection.updateOne({ _id: doc._id }, { $set: { notes: fixedNotes } });
                console.log(`Fixed typo in ${colName} document: ${doc._id}`);
            }
        }

        console.log('Cleanup complete');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

fixTypos();
