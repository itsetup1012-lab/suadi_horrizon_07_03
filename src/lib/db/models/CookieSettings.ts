import mongoose, { Schema, Document } from 'mongoose';

export interface ICookieSettings extends Document {
    enabled: boolean;
    necessaryOnly: boolean;
    analytics: boolean;
    marketing: boolean;
    position: string;
    expiration: number;
    lastUpdated: Date;
}

const CookieSettingsSchema: Schema = new Schema({
    enabled: { type: Boolean, default: true },
    necessaryOnly: { type: Boolean, default: false },
    analytics: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false },
    position: { type: String, default: 'bottom' },
    expiration: { type: Number, default: 365 },
    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.models.CookieSettings || mongoose.model<ICookieSettings>('CookieSettings', CookieSettingsSchema);
