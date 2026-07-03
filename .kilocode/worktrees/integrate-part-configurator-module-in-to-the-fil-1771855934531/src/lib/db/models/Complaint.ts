import mongoose, { Document, Schema } from 'mongoose';

export interface IComplaint extends Document {
    user: mongoose.Types.ObjectId;
    ticketId: string;
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    resolution?: string;
    createdAt: Date;
    updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticketId: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'closed'],
        default: 'open'
    },
    resolution: String
}, {
    timestamps: true
});

// Auto-generate ticketId if not provided
complaintSchema.pre('validate', async function (this: IComplaint) {
    if (!this.ticketId) {
        this.ticketId = 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
});

const Complaint = mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', complaintSchema);

export default Complaint;
