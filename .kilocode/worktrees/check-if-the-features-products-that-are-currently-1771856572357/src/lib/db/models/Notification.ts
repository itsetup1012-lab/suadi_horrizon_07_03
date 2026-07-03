import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
