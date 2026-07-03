import mongoose, { Document, Schema } from 'mongoose';

export interface IPromotion extends Document {
    code: string;
    title: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: Date;
    expiryDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const promotionSchema = new Schema<IPromotion>({
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Promotion = mongoose.models.Promotion || mongoose.model<IPromotion>('Promotion', promotionSchema);

export default Promotion;
