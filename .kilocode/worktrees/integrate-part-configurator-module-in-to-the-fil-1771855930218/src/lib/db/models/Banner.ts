import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
    title: string;
    image: string;
    link?: string;
    position: string;
    isActive: boolean;
    createdAt: Date;
}

const bannerSchema = new Schema<IBanner>({
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    position: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false
});

const Banner = mongoose.models.Banner || mongoose.model<IBanner>('Banner', bannerSchema);

export default Banner;
