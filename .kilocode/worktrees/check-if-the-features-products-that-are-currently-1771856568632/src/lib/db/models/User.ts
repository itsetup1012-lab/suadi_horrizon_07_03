import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAddress {
    _id: mongoose.Types.ObjectId;
    name: string;
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

export interface IPaymentMethod {
    _id: mongoose.Types.ObjectId;
    type: string;
    last4: string;
    expiry: string;
    name: string;
    isDefault: boolean;
}

export interface INotificationPreferences {
    orderUpdates: boolean;
    promotionalEmails: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
    newProducts: boolean;
    priceAlerts: boolean;
}

export interface IUserProfile {
    name: string;
    phone?: string;
    company?: string;
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string | null;
    role: string;
    refreshToken: string | null;
    oauthProvider?: string | null;
    oauthId?: string | null;
    profile?: IUserProfile;
    addresses?: IAddress[];
    paymentMethods?: IPaymentMethod[];
    notificationPreferences?: INotificationPreferences;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>({
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});

const paymentMethodSchema = new Schema<IPaymentMethod>({
    type: { type: String, required: true },
    last4: { type: String, required: true },
    expiry: { type: String, required: true },
    name: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});

const notificationPreferencesSchema = new Schema<INotificationPreferences>({
    orderUpdates: { type: Boolean, default: true },
    promotionalEmails: { type: Boolean, default: false },
    smsNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false },
    newProducts: { type: Boolean, default: true },
    priceAlerts: { type: Boolean, default: true },
});

const userProfileSchema = new Schema<IUserProfile>({
    name: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
});

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: function (this: IUser) {
                // Password is required unless using OAuth
                return !this.oauthProvider;
            },
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        refreshToken: {
            type: String,
            default: null,
        },
        oauthProvider: {
            type: String,
            default: null,
        },
        oauthId: {
            type: String,
            default: null,
        },
        profile: {
            type: userProfileSchema,
            default: { name: '' },
        },
        addresses: {
            type: [addressSchema],
            default: [],
        },
        paymentMethods: {
            type: [paymentMethodSchema],
            default: [],
        },
        notificationPreferences: {
            type: notificationPreferencesSchema,
            default: {
                orderUpdates: true,
                promotionalEmails: false,
                smsNotifications: true,
                pushNotifications: true,
                newsletter: false,
                newProducts: true,
                priceAlerts: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (this: IUser) {
    if (!this.isModified('password') || !this.password) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error: unknown) {
        throw error as Error;
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) {
        return false;
    }
    return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
