const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkNotifications() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        const NotificationSchema = new mongoose.Schema({
            type: String,
            title: String,
            message: String,
            isRead: Boolean,
            createdAt: Date
        });
        const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

        const latest = await Notification.find().sort({ createdAt: -1 }).limit(5);
        console.log('Latest 5 Notifications:');
        latest.forEach(n => {
            console.log(`[${n.createdAt.toISOString()}] ${n.type} - ${n.title}: ${n.message}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkNotifications();
