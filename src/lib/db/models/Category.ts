import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Omit<Document, '_id'> {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent?: string; // Reference to another category ID (string)
    displayOrder: number;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
    _id: { type: String, required: true }, // Using manual string ID (slug)
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String,
    parent: { type: String, ref: 'Category', default: null }, // Self-referencing slug or ID
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed }
}, {
    timestamps: true,
    _id: false // Controlled by us
});

// Index for faster lookups
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });

// Force model re-registration in dev for schema changes
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Category;
}

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;
