import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct extends Omit<Document, '_id'> {
    _id: string; // Use string ID as in JSON
    name: string;
    sku: string;
    brand: string;
    category: string;
    subcategory?: string;
    price: number;
    image?: string;
    description?: string;
    specs?: Record<string, any>;
    compatibility?: string[];
    inStock: boolean;
    stock: number;
    rating?: number;
    reviews?: number;
    oemCode?: string;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    _id: { type: String, required: true }, // Overriding default ObjectId
    name: { type: String, required: true },
    sku: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: String,
    price: { type: Number, required: true, default: 0 },
    image: String,
    description: String,
    specs: { type: Schema.Types.Mixed },
    compatibility: [String],
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    oemCode: String
}, {
    timestamps: true,
    _id: false // Disable auto-generation since we use string IDs from JSON
});

// Prevent model recompilation in development
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
