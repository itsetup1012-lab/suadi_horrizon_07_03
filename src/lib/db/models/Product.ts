import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICloudinaryImage {
    url: string;
    public_id: string;
}

export interface IProduct extends Omit<Document, '_id'> {
    _id: string; // Use string ID as in JSON (SKU)
    name: string;
    sku: string;
    brand: string; // Ref to Brand model
    category: string; // Ref to Category model
    subcategory?: string; // Ref to Category model
    price: number;
    image?: ICloudinaryImage; // Primary image
    gallery?: ICloudinaryImage[]; // Additional brand photos
    documents?: { // Spec sheets, manuals, etc.
        name: string;
        url: string;
    }[];
    description?: string;
    specs?: Record<string, any>;
    compatibility?: string[];
    inStock: boolean;
    stock: number;
    rating?: number;
    reviews?: number;
    oemCode?: string;
    featured?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    _id: { type: String, required: true }, // Overriding default ObjectId
    name: { type: String, required: true },
    sku: { type: String, required: true, index: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, ref: 'Category' },
    price: { type: Number, required: true, default: 0 },
    image: {
        url: { type: String },
        public_id: { type: String }
    },
    gallery: [{
        url: { type: String },
        public_id: { type: String }
    }],
    documents: [{
        name: { type: String },
        url: { type: String }
    }],
    description: String,
    specs: { type: Schema.Types.Mixed },
    compatibility: [String],
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    oemCode: String,
    featured: { type: Boolean, default: false }
}, {
    timestamps: true,
    _id: false // Disable auto-generation since we use string IDs from JSON
});

// Prevent model recompilation in development
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
