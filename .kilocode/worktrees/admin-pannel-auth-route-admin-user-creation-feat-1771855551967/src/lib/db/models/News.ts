import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INews extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    isPublished: boolean;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const newsSchema = new Schema<INews>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
    versionKey: false
});

// Prevent model recompilation in development
const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', newsSchema);

export default News;
