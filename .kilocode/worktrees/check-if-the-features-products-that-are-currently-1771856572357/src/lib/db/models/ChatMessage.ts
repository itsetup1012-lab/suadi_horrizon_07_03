import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IChatMessage extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
    read: boolean;
}

const chatMessageSchema = new Schema<IChatMessage>({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
}, {
    versionKey: false,
});

// Prevent model recompilation in development
const ChatMessage: Model<IChatMessage> = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);

export default ChatMessage;
