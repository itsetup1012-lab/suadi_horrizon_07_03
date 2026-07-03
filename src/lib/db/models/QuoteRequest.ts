import mongoose, { Document, Schema } from 'mongoose';

export interface IQuoteRequest extends Document {
    userId?: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    projectType?: string;
    items: string;
    quantities?: string;
    timeline?: string;
    notes?: string;
    status: 'pending' | 'reviewed' | 'responded' | 'accepted' | 'cancelled';
    messages?: Array<{
        sender: 'admin' | 'user';
        text: string;
        createdAt: Date;
    }>;
    adminResponse?: string; // Kept for backward compatibility or as the latest response summary
    // Structured quote fields set by sales team
    quotedPrice?: number;       // SAR total quoted
    validUntil?: Date;          // Quote expiry
    // Acceptance tracking
    acceptedAt?: Date;
    orderId?: string;           // Linked order after acceptance
    createdAt: Date;
    updatedAt: Date;
}

const quoteRequestSchema = new Schema<IQuoteRequest>({
    userId: { type: String, ref: 'User' },
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    projectType: { type: String },
    items: { type: String, required: true },
    quantities: { type: String },
    timeline: { type: String },
    notes: { type: String },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'responded', 'accepted', 'cancelled'],
        default: 'pending'
    },
    messages: [{
        sender: { type: String, enum: ['admin', 'user'], required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    adminResponse: { type: String },
    quotedPrice: { type: Number },
    validUntil: { type: Date },
    acceptedAt: { type: Date },
    orderId: { type: String },
}, {
    timestamps: true
});

const QuoteRequest = mongoose.models.QuoteRequest || mongoose.model<IQuoteRequest>('QuoteRequest', quoteRequestSchema);

export default QuoteRequest;
