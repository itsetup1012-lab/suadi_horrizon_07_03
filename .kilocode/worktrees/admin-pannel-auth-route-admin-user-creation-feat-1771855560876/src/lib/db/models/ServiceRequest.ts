import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceRequest extends Document {
    user: mongoose.Types.ObjectId;
    machine: string;
    issue: string;
    preferredTime?: Date;
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const serviceRequestSchema = new Schema<IServiceRequest>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    machine: { type: String, required: true },
    issue: { type: String, required: true },
    preferredTime: Date,
    status: {
        type: String,
        enum: ['pending', 'scheduled', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: String
}, {
    timestamps: true
});

const ServiceRequest = mongoose.models.ServiceRequest || mongoose.model<IServiceRequest>('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
