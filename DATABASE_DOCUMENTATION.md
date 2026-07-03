# Saudi Horizon Database Documentation

## Overview

This document describes the MongoDB database schemas for the Saudi Horizon e-commerce platform. The database is named `saudi_horizon` and uses MongoDB with Mongoose ODM.

## Database Connection

- **Database Name**: `saudi_horizon`
- **Connection URI**: `mongodb://localhost:27017/saudi_horizon`
- **Environment Variable**: `DATABASE_URL`
- **Connection Pattern**: Cached connection with global mongoose to prevent connection growth during hot reloads
- **Model Pre-loading**: Category and Brand models are pre-registered on connection to ensure populate works correctly

---

## Collections

The database contains 19 collections:

| Collection | Documents | Description |
|------------|-----------|--------------|
| `products` | **720** | Product catalog |
| `categories` | 10 | Product categories |
| `brands` | 6 | Brand definitions |
| `users` | 12 | User accounts |
| `orders` | 0 | Customer orders |
| `invoices` | 7 | Generated invoices |
| `quotes` | 1 | Quote records |
| `quoterequests` | 15 | Quote requests from customers |
| `notifications` | 16 | System notifications |
| `banners` | 3 | Homepage banners |
| `news` | 0 | Blog/news articles |
| `settings` | 2 | Site settings |
| `homepage_config` | 1 | Homepage configuration |
| `cookieconsentrecords` | 8 | Cookie consent logs |
| `cookiesettings` | 1 | Cookie settings |
| `promotions` | 0 | Promotional codes |
| `servicerequests` | 0 | Service requests |
| `chatmessages` | 0 | Chat messages |
| `complaints` | 0 | Complaint tickets |

---

## Schema Definitions

### 1. Product (`products`)

**Purpose**: Store product catalog items

```typescript
interface IProduct {
    _id: string;           // SKU/Product ID (string)
    name: string;          // Product name
    sku: string;           // Stock keeping unit (indexed)
    brand: string;         // Reference to Brand._id
    category: string;      // Reference to Category._id
    subcategory?: string;  // Optional subcategory
    price: number;        // Price in SAR
    image?: {             // Primary product image
        url: string;
        public_id: string; // Cloudinary public ID
    };
    gallery?: {           // Additional images
        url: string;
        public_id: string;
    }[];
    documents?: {          // Spec sheets, manuals
        name: string;
        url: string;
    }[];
    description?: string;
    specs?: Record<string, any>;
    compatibility?: string[]; // Compatible machines
    inStock: boolean;
    stock: number;
    rating?: number;
    reviews?: number;
    oemCode?: string;
    featured?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
```

---

### 2. Category (`categories`)

**Purpose**: Organize products into categories

```typescript
interface ICategory {
    _id: string;           // Category ID (slug)
    name: string;          // Display name
    slug: string;          // URL-friendly slug (unique, indexed)
    description?: string;
    image?: string;        // Category image URL
    parent?: string;       // Parent category (self-referencing)
    displayOrder: number; // Sort order
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
```

---

### 3. Brand (`brands`)

**Purpose**: Define product manufacturers

```typescript
interface IBrand {
    _id: string;           // Brand ID (slug)
    name: string;          // Display name
    slug: string;          // URL-friendly slug (unique, indexed)
    description?: string;
    logo?: string;         // Brand logo URL
    website?: string;       // Brand website
    isFeatured: boolean;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
```

---

### 4. User (`users`)

**Purpose**: Customer and admin accounts

```typescript
interface IUser {
    _id: mongoose.Types.ObjectId;
    email: string;              // Unique email
    password: string | null;     // Hashed password (null for OAuth)
    role: 'user' | 'admin';
    refreshToken?: string | null;
    oauthProvider?: string | null;
    oauthId?: string | null;
    profile?: {
        name: string;
        phone?: string;
        company?: string;
    };
    addresses?: {
        name: string;
        fullName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone: string;
        isDefault: boolean;
    }[];
    paymentMethods?: {
        type: string;
        last4: string;
        expiry: string;
        name: string;
        isDefault: boolean;
    }[];
    wishlist?: string[];        // Product IDs
    notificationPreferences?: {
        orderUpdates: boolean;
        promotionalEmails: boolean;
        smsNotifications: boolean;
        pushNotifications: boolean;
        newsletter: boolean;
        newProducts: boolean;
        priceAlerts: boolean;
    };
    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
```

---

### 5. Order (`orders`)

**Purpose**: Store customer purchase orders

```typescript
interface IOrder {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;     // Reference to User
    items: {
        product: string;               // Product SKU
        quantity: number;
        price: number;
    }[];
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
```

---

### 6. Invoice (`invoices`)

**Purpose**: Generate and track invoices

```typescript
interface IInvoice {
    invoiceNumber: string;      // Unique invoice number
    sourceType: 'order' | 'quote';
    sourceId: string;
    customer: {
        name: string;
        company?: string;
        email: string;
        phone?: string;
        address?: string;
    };
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    subtotal: number;
    vatRate: number;           // Default 15%
    vatAmount: number;
    totalAmount: number;
    currency: string;          // Default SAR
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    dueDate?: Date;
    paidAt?: Date;
    notes?: string;
    createdBy: string;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
```

---

### 7. Quote Request (`quoterequests`)

**Purpose**: Track customer quote requests

> **Note**: The `quotes` collection in MongoDB is empty. Quote data is stored in the `quoterequests` collection. The API uses the `QuoteRequest` model.

```typescript
interface IQuoteRequest {
    userId?: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    projectType?: string;
    items: string;
    quantities?: string;
    timeline?: string;
    notes?: string;
    status: 'pending' | 'reviewed' | 'responded' | 'accepted' | 'cancelled';
    messages?: {
        sender: 'admin' | 'user';
        text: string;
        createdAt: Date;
    }[];
    adminResponse?: string;
    quotedPrice?: number;
    validUntil?: Date;
    acceptedAt?: Date;
    orderId?: string;
    createdAt: Date;
    updatedAt: Date;
}
```

---

### 8. Quote (`quotes`)

**Purpose**: Legacy/empty collection (quotes are stored in `quoterequests`)

> This collection is currently unused. All quote functionality uses the `QuoteRequest` model with the `quoterequests` collection.

```typescript
// No active schema - uses QuoteRequest instead
```

---

### 9. Notification (`notifications`)

**Purpose**: System notifications (auto-delete after 60 days)

```typescript
interface INotification {
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;  // Indexed with 60-day TTL
}
```

---

### 10. Banner (`banners`)

**Purpose**: Homepage banner images

```typescript
interface IBanner {
    title: string;
    image: string;         // Banner image URL
    link?: string;         // Click-through URL
    position: string;      // Banner position
    isActive: boolean;
    createdAt: Date;
}
```

---

### 11. News (`news`)

**Purpose**: Blog posts and news articles

```typescript
interface INews {
    title: string;
    slug: string;           // Unique URL slug
    excerpt: string;
    content: string;       // Full article content
    image: string;
    category: string;
    author: string;
    isPublished: boolean;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
```

---

### 12. Homepage Config (`homepage_config`)

**Purpose**: Configure homepage sections and content (singleton)

```typescript
interface IHomepageConfig {
    featuredProductIds: string[];
    featuredProductsCount: number;
    sections: {
        id: string;
        label: string;
        visible: boolean;
        order: number;
    }[];
    stats: {
        yearsExperience: number;
        satisfiedClients: number;
        partsAvailable: number;
        onTimeDelivery: number;
    };
    testimonials: {
        quote: string;
        author: string;
        role: string;
        company: string;
        isActive: boolean;
    }[];
    heroTitle: string;
    heroSubtitle: string;
    updatedAt: Date;
    updatedBy: string;
}
```

---

### 13. Promotion (`promotions`)

**Purpose**: Discount codes and promotions

```typescript
interface IPromotion {
    code: string;           // Unique promo code
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
```

---

### 14. Cookie Settings (`cookiesettings`)

**Purpose**: Global cookie consent settings (singleton)

```typescript
interface ICookieSettings {
    enabled: boolean;
    necessaryOnly: boolean;
    analytics: boolean;
    marketing: boolean;
    position: string;
    expiration: number;
    lastUpdated: Date;
}
```

---

### 15. Cookie Consent Record (`cookieconsentrecords`)

**Purpose**: Track user cookie consents (auto-delete after 180 days)

```typescript
interface ICookieConsentRecord {
    consentId: string;       // Unique consent ID
    categories: {
        necessary: boolean;
        analytics: boolean;
        marketing: boolean;
        preferences: boolean;
    };
    userAgent: string;
    ipHash?: string;
    timestamp: Date;         // Indexed with 180-day TTL
}
```

---

### 16. Complaint (`complaints`)

**Purpose**: Customer complaint tickets

```typescript
interface IComplaint {
    user: mongoose.Types.ObjectId;
    ticketId: string;        // Unique ticket ID (auto-generated)
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    resolution?: string;
    createdAt: Date;
    updatedAt: Date;
}
```

---

### 17. Service Request (`servicerequests`)

**Purpose**: Field service requests

```typescript
interface IServiceRequest {
    user: mongoose.Types.ObjectId;
    machine: string;
    issue: string;
    preferredTime?: Date;
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
```

---

### 18. Chat Message (`chatmessages`)

**Purpose**: User-to-admin chat messages

```typescript
interface IChatMessage {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
    read: boolean;
}
```

---

## Image Storage

Product images are stored in **Cloudinary** with the following configuration:

- **Cloud Name**: `dhceecekr`
- **Folder**: `saudi-horizon`
- **Resource Type**: `auto` (images, videos, etc.)

Images are stored as objects in the database:
```typescript
{
    url: string;        // Cloudinary secure URL
    public_id: string;  // Cloudinary public ID for deletion
}
```

---

## API Endpoints

### Upload Endpoints
- `POST /api/upload` - Upload file to Cloudinary
- `POST /api/upload/delete` - Delete file from Cloudinary

### Product Endpoints
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product
- `PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Category Endpoints
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category

### Brand Endpoints
- `GET /api/brands` - List brands
- `POST /api/brands` - Create brand

---

## Notes

1. **ID Strategy**: Products use string IDs (SKU), while most other collections use MongoDB ObjectIds
2. **Timestamps**: All collections include `createdAt` and `updatedAt` fields
3. **Soft Deletes**: Not implemented - deletions are permanent
4. **Caching**: Database connection is warmed up on first request
5. **Indexes**: 
   - Product.sku: Indexed for fast lookups
   - Category.slug, Brand.slug: Indexed for URL lookups
   - Category.parent: Indexed for hierarchy queries
   - Notification.createdAt: TTL index - auto-delete after 60 days
   - CookieConsentRecord.timestamp: TTL index - auto-delete after 180 days

---

## Inventory Management

The inventory system uses **MongoDB** (not mock/JSON data):

- **Admin Inventory Page** (`/admin/inventory`): Fetches from `/api/products` API which reads from MongoDB
- **Analytics** (`/api/admin/analytics/inventory`): Uses `Product.aggregate()` for inventory value calculations
- **Stock Updates**: PATCH requests to `/api/products/[id]` update stock in MongoDB

### Data Flow
```
Admin Inventory Page 
  → GET /api/products?limit=1000 
    → Product.find() from MongoDB
      → Return products with stock info

Stock Adjustment
  → PATCH /api/products/[id] { stock: newValue }
    → Product.findByIdAndUpdate() in MongoDB
      → Low stock notifications triggered if < 10 units
```

> **Note**: The database currently has 3 products. Use the seed scripts (`scripts/seed-products.js` or `scripts/refresh-products.ts`) to populate more products from `products.json`.

---

## Seed Scripts

Several scripts exist to populate the database from `products.json`:

| Script | Purpose |
|--------|---------|
| `scripts/seed-products.js` | Insert products into MongoDB |
| `scripts/refresh-products.ts` | Refresh/re-sync products from JSON |
| `scripts/replace-mongodb-products.js` | Replace all products in MongoDB |
| `scripts/sync-prices-to-mongodb.js` | Sync prices only from JSON |
