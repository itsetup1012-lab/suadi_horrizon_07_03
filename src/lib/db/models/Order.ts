import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOrderItem {
    product: string; // Changed from mongoose.Types.ObjectId to match Product._id
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    shippingAddress: {
        name: string;
        company?: string;
        street1: string;
        street2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        phone?: string;
        email?: string;
    };
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    trackingNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema({
    product: { type: String, ref: 'Product', required: true }, // Changed from ObjectId to String
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const orderSchema = new Schema<IOrder>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        name: { type: String, required: true },
        company: String,
        street1: { type: String, required: true },
        street2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
        phone: String,
        email: String
    },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    trackingNumber: String
}, {
    timestamps: true,
    versionKey: false,
});

// Prevent model recompilation in development
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
