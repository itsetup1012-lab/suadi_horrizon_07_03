import api from './api';
import { AxiosError } from 'axios';

// Address types
export interface Address {
    _id: string;
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

// Payment method types
export interface PaymentMethod {
    _id: string;
    type: string;
    last4: string;
    expiry: string;
    name: string;
    isDefault: boolean;
}

// Notification preferences types
export interface NotificationPreferences {
    orderUpdates: boolean;
    promotionalEmails: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
    newProducts: boolean;
    priceAlerts: boolean;
}

// User profile types
export interface UserProfile {
    email: string;
    name: string;
    phone: string;
    company: string;
    role: string;
    createdAt: string;
}

// Order types
export interface OrderItem {
    product: any;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: any;
    status: string;
    createdAt: string;
    updatedAt: string;
}

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const data = error.response?.data as { error?: string } | undefined;
        return data?.error || error.message || 'Unknown error';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Unknown error';
};

// Address API functions
export const getAddresses = async (): Promise<Address[]> => {
    try {
        const response = await api.get('/api/users/addresses');
        return response.data;
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const addAddress = async (address: Omit<Address, '_id'>): Promise<Address> => {
    try {
        const response = await api.post('/api/users/addresses', address);
        return response.data;
    } catch (error) {
        console.error('Error adding address:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const updateAddress = async (id: string, address: Partial<Address>): Promise<Address> => {
    try {
        const response = await api.put(`/api/users/addresses/${id}`, address);
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const deleteAddress = async (id: string): Promise<void> => {
    try {
        await api.delete(`/api/users/addresses/${id}`);
    } catch (error) {
        console.error('Error deleting address:', error);
        throw new Error(getErrorMessage(error));
    }
};

// Payment method API functions
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    try {
        const response = await api.get('/api/users/payment-methods');
        return response.data;
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const addPaymentMethod = async (paymentMethod: { type: string; cardNumber: string; expiry: string; cvv: string; name: string; isDefault?: boolean }): Promise<PaymentMethod> => {
    try {
        const response = await api.post('/api/users/payment-methods', paymentMethod);
        return response.data;
    } catch (error) {
        console.error('Error adding payment method:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
    try {
        await api.delete(`/api/users/payment-methods/${id}`);
    } catch (error) {
        console.error('Error deleting payment method:', error);
        throw new Error(getErrorMessage(error));
    }
};

// Notification preferences API functions
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
    try {
        const response = await api.get('/api/users/notifications');
        return response.data;
    } catch (error) {
        console.error('Error fetching notification preferences:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const updateNotificationPreferences = async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    try {
        const response = await api.put('/api/users/notifications', preferences);
        return response.data;
    } catch (error) {
        console.error('Error updating notification preferences:', error);
        throw new Error(getErrorMessage(error));
    }
};

// User profile API functions
export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const response = await api.get('/api/users/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const updateUserProfile = async (profile: { name?: string; phone?: string; company?: string; currentPassword?: string; newPassword?: string }): Promise<{ message: string }> => {
    try {
        const response = await api.put('/api/users/profile', profile);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error(getErrorMessage(error));
    }
};

// Orders API functions
export const getOrders = async (): Promise<Order[]> => {
    try {
        const response = await api.get('/api/orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error(getErrorMessage(error));
    }
};

export const getOrderById = async (id: string): Promise<Order> => {
    try {
        const response = await api.get(`/api/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw new Error(getErrorMessage(error));
    }
};
