export interface User {
    _id: string;
    email: string;
    name?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    isActive?: boolean;
    avatar?: string;
    phone?: string;
}
