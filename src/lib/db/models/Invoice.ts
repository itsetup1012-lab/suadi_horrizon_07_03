import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IInvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface IInvoice extends Document {
    invoiceNumber: string;
    sourceType: 'order' | 'quote';
    sourceId: string;
    customer: {
        name: string;
        company?: string;
        email: string;
        phone?: string;
        address?: string;
    };
    items: IInvoiceItem[];
    subtotal: number;
    vatRate: number;
    vatAmount: number;
    totalAmount: number;
    currency: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    dueDate?: Date;
    paidAt?: Date;
    notes?: string;
    createdBy: string;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const invoiceItemSchema = new Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
});

const invoiceSchema = new Schema<IInvoice>({
    invoiceNumber: { type: String, unique: true, sparse: true },
    sourceType: { type: String, enum: ['order', 'quote'], required: true },
    sourceId: { type: String, required: true },
    customer: {
        name: { type: String, required: true },
        company: String,
        email: { type: String, required: true },
        phone: String,
        address: String,
    },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    vatRate: { type: Number, default: 15 },
    vatAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'SAR' },
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
        default: 'draft',
    },
    dueDate: Date,
    paidAt: Date,
    notes: String,
    createdBy: { type: String, required: true },
    sentAt: Date,
}, {
    timestamps: true,
    versionKey: false,
});

// Force schema re-compile on hot reload in development
if (process.env.NODE_ENV === 'development' && mongoose.models.Invoice) {
    delete mongoose.models.Invoice;
}

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', invoiceSchema);

export default Invoice;
