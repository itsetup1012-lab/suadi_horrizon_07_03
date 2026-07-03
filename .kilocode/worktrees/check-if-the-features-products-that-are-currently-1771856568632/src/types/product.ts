export interface IProduct {
    _id: string;
    name: string;
    sku: string;
    brand: string;
    category: string;
    subcategory?: string;
    price: number;
    image?: string;
    description?: string;
    specs?: Record<string, any>;
    compatibility?: string[];
    inStock: boolean;
    stock: number;
    rating?: number;
    reviews?: number;
    oemCode?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
