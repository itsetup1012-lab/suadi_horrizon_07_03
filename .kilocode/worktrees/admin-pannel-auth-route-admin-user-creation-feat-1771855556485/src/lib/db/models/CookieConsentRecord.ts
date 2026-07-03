import mongoose, { Schema, Document } from 'mongoose';

export interface ICookieConsentRecord extends Document {
    consentId: string;
    categories: {
        necessary: boolean;
        analytics: boolean;
        marketing: boolean;
        preferences: boolean;
    };
    userAgent: string;
    ipHash?: string; // Storing a hash for privacy while allowing unique counting
    timestamp: Date;
}

const CookieConsentRecordSchema: Schema = new Schema({
    consentId: { type: String, required: true, unique: true },
    categories: {
        necessary: { type: Boolean, default: true },
        analytics: { type: Boolean, default: false },
        marketing: { type: Boolean, default: false },
        preferences: { type: Boolean, default: false }
    },
    userAgent: { type: String },
    ipHash: { type: String },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.models.CookieConsentRecord || mongoose.model<ICookieConsentRecord>('CookieConsentRecord', CookieConsentRecordSchema);
