declare module "@shared/types/user" {
    export interface User {
        _id: string;
        email: string;
        name?: string;
        role: string;
        createdAt: string;
        updatedAt: string;
    }
}