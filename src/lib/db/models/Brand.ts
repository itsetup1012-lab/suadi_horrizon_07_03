import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBrand extends Omit<Document, '_id'> {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    website?: string;
    isFeatured: boolean;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const brandSchema = new Schema<IBrand>({
    _id: { type: String, required: true }, // Using manual string ID (slug)
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    logo: String,
    website: String,
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed }
}, {
    timestamps: true,
    _id: false // Controlled by us
});

brandSchema.index({ slug: 1 });

// Force model re-registration in dev to apply schema changes
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Brand;
}

const Brand: Model<IBrand> = mongoose.models.Brand || mongoose.model<IBrand>('Brand', brandSchema);

export default Brand;
