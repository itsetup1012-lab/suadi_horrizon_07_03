# Database Schema Design for Admin Panel

## Overview
This document outlines the database schema extensions required for the admin panel, including new models for admin users, banners, notifications, and recent views, while integrating with the existing e-commerce models.

## Existing Models Analysis

### Current Models (from existing project)
- **User**: Customer user model with authentication
- **Product**: Product catalog with pricing and inventory
- **Order**: Order management with items and status
- **Banner**: Marketing banners (basic implementation)
- **Notification**: User notifications

## New Models for Admin Panel

### 1. AdminUser Model
**Purpose**: Admin authentication and management system

```typescript
interface AdminUser {
  email: string;                    // Unique email for login
  password: string;                // Hashed password
  role: 'superadmin' | 'admin' | 'moderator'; // Access level
  permissions: string[];           // Array of permission strings
  lastLogin: Date;                 // Last successful login
  isActive: boolean;               // Account status
  createdBy: ObjectId;             // Reference to creator admin
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

**Indexes**:
- `email: 1` (unique)
- `role: 1`
- `isActive: 1`
- `createdAt: -1`

**Relationships**:
- `createdBy` → AdminUser (self-reference)

### 2. Banner Model (Extended)
**Purpose**: Enhanced banner management system

```typescript
interface Banner {
  title: string;                  // Banner title
  description: string;            // Banner description
  imageUrl: string;                // Image URL
  targetUrl: string;               // Click target URL
  position: 'header' | 'sidebar' | 'footer' | 'homepage'; // Display position
  status: 'active' | 'inactive';    // Current status
  startDate: Date;                 // Display start date
  endDate: Date;                    // Display end date
  createdBy: ObjectId;             // Admin who created
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

**Indexes**:
- `position: 1`
- `status: 1`
- `startDate: 1`
- `endDate: 1`
- `createdAt: -1`

**Relationships**:
- `createdBy` → AdminUser

### 3. Notification Model (Extended)
**Purpose**: Enhanced notification system for both users and admins

```typescript
interface Notification {
  type: 'info' | 'warning' | 'error' | 'success'; // Notification type
  title: string;                  // Notification title
  message: string;                // Notification message
  targetId: ObjectId;             // Related entity ID
  targetType: string;              // Related entity type (e.g., 'order', 'product')
  read: boolean;                  // Read status
  userId: ObjectId;               // User who should receive (null for admin notifications)
  adminId: ObjectId;              // Admin who created (null for system notifications)
  createdBy: ObjectId;             // Admin who created
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

**Indexes**:
- `userId: 1, read: 1`
- `adminId: 1`
- `createdAt: -1`
- `type: 1`

**Relationships**:
- `userId` → User
- `adminId` → AdminUser
- `createdBy` → AdminUser

### 4. RecentView Model
**Purpose**: Track recently viewed products for personalized experience

```typescript
interface RecentView {
  userId: ObjectId;                // User who viewed
  productId: ObjectId;             // Product that was viewed
  viewedAt: Date;                  // View timestamp
  session: string;                 // Session identifier
  ipAddress: string;               // IP address for analytics
  userAgent: string;               // User agent for device info
}
```

**Indexes**:
- `userId: 1, viewedAt: -1` (for user's recent views)
- `productId: 1, viewedAt: -1` (for product popularity)
- `session: 1` (for session-based tracking)
- `viewedAt: -1` (for recent activity)

**Relationships**:
- `userId` → User
- `productId` → Product

### 5. StockNotification Model
**Purpose**: Stock notification system for low inventory alerts

```typescript
interface StockNotification {
  productId: ObjectId;             // Product with low stock
  currentStock: number;            // Current stock level
  threshold: number;                // Stock threshold that triggered notification
  notifiedAdmins: ObjectId[];      // Admins who were notified
  lastNotification: Date;           // Last notification timestamp
  frequency: 'immediate' | 'daily' | 'weekly'; // Notification frequency
  isActive: boolean;               // Whether notification is active
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

**Indexes**:
- `productId: 1`
- `isActive: 1`
- `lastNotification: 1`

**Relationships**:
- `productId` → Product
- `notifiedAdmins` → AdminUser

## Extended Existing Models

### User Model Extensions
**Purpose**: Add admin-specific user management features

```typescript
interface User {
  // Existing fields...
  isAdmin: boolean;                // Whether user has admin privileges
  adminNotes: string;              // Admin notes about the user
  lastActivity: Date;              // Last user activity timestamp
  totalSpent: number;              // Total amount spent by user
  orderCount: number;              // Total number of orders
  // New fields for admin management
  isActive: boolean;               // User account status
  verificationStatus: 'pending' | 'verified' | 'rejected'; // Verification status
  verificationDate: Date;           // Verification timestamp
  blockedReason: string;           // Reason for account block
}
```

**Indexes**:
- `isAdmin: 1`
- `isActive: 1`
- `verificationStatus: 1`
- `lastActivity: -1`

### Product Model Extensions
**Purpose**: Add admin-specific product management features

```typescript
interface Product {
  // Existing fields...
  // New fields for admin management
  minStockLevel: number;           // Minimum stock level for notifications
  maxDiscount: number;             // Maximum allowed discount percentage
  isFeatured: boolean;             // Whether product is featured
  featuredOrder: number;           // Order for featured products
  adminNotes: string;              // Admin notes about the product
  supplierId: ObjectId;            // Supplier reference
  costPrice: number;               // Cost price for profit calculation
  profitMargin: number;            // Target profit margin
}
```

**Indexes**:
- `isFeatured: 1, featuredOrder: 1`
- `minStockLevel: 1, stock: 1`
- `supplierId: 1`

### Order Model Extensions
**Purpose**: Add admin-specific order management features

```typescript
interface Order {
  // Existing fields...
  // New fields for admin management
  adminNotes: string;              // Admin notes about the order
  internalStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'; // Internal status
  assignedTo: ObjectId;            // Admin assigned to handle order
  priority: 'low' | 'medium' | 'high' | 'urgent'; // Order priority
  expectedDelivery: Date;           // Expected delivery date
  actualDelivery: Date;             // Actual delivery date
}
```

**Indexes**:
- `internalStatus: 1`
- `assignedTo: 1`
- `priority: 1`
- `expectedDelivery: 1`

## Database Relationships

### Core Relationships
```
AdminUser
├── createdBanners → Banner (1:N)
├── createdNotifications → Notification (1:N)
├── createdUsers → User (1:N)
└── assignedOrders → Order (1:N)

User
├── recentViews → RecentView (1:N)
├── notifications → Notification (1:N)
└── orders → Order (1:N)

Product
├── recentViews → RecentView (1:N)
├── stockNotifications → StockNotification (1:N)
└── orders → Order (N:N via order items)

Order
├── user → User (1:1)
├── assignedAdmin → AdminUser (1:1)
└── items → Product (N:N via order items)

Banner
└── createdBy → AdminUser (1:1)

Notification
├── user → User (1:1)
├── admin → AdminUser (1:1)
└── createdBy → AdminUser (1:1)

RecentView
├── user → User (1:1)
└── product → Product (1:1)

StockNotification
├── product → Product (1:1)
└── notifiedAdmins → AdminUser (N:N)
```

## Database Indexes Strategy

### Performance Indexes
1. **User queries**: `email: 1`, `isActive: 1`, `createdAt: -1`
2. **Product queries**: `category: 1`, `price: 1`, `stock: 1`, `isFeatured: 1`
3. **Order queries**: `status: 1`, `createdAt: -1`, `user: 1`
4. **Admin queries**: `role: 1`, `isActive: 1`, `lastLogin: -1`

### Analytics Indexes
1. **Recent views**: `userId: 1, viewedAt: -1`, `productId: 1, viewedAt: -1`
2. **Notifications**: `userId: 1, read: 1, createdAt: -1`
3. **Stock alerts**: `productId: 1, isActive: 1`

### Search Indexes
1. **Text search**: Compound text index on product names and descriptions
2. **Geospatial**: For location-based features (if needed)

## Database Migration Strategy

### Phase 1: Schema Extensions
1. Add new collections: `adminUsers`, `stockNotifications`, `recentViews`
2. Extend existing collections with new fields
3. Create necessary indexes

### Phase 2: Data Population
1. Migrate existing banner data to extended model
2. Set up default admin user
3. Initialize stock notification thresholds

### Phase 3: Optimization
1. Analyze query performance
2. Add additional indexes as needed
3. Optimize data models based on usage patterns

## Security Considerations

### Data Access Control
- Admin users can only access data they have permissions for
- Sensitive data (passwords, payment info) is never exposed to admins
- Audit logging for all admin data access

### Data Validation
- Schema validation for all models
- Input sanitization for admin forms
- Rate limiting for admin API endpoints

### Backup Strategy
- Regular database backups
- Point-in-time recovery capability
- Data retention policies for analytics data

This database schema provides a robust foundation for the admin panel while maintaining compatibility with the existing e-commerce system and ensuring scalability for future growth.
## Overview
This document outlines the database schema extensions required for the admin panel, including new models for admin users, banners, notifications, and recent views, while integrating with the existing e-commerce models.

## Existing Models Analysis

### Current Models (from existing project)
- **User**: Customer user model with authentication
- **Product**: Product catalog with pricing and inventory
- **Order**: Order management with items and status
- **Banner**: Marketing banners (basic implementation)
- **Notification**: User notifications

## New Models for Admin Panel

### 1. AdminUser Model
**Purpose**: Admin authentication and management system

```typescript
interface AdminUser {
  email: string;                    // Unique email for login
  password: string;                // Hashed password
  role: 'superadmin' | 'admin' | 'moderator'; // Access level
  permissions: string[];           // Array of permission strings
  lastLogin: Date;                 // Last successful login
  isActive: boolean;               // Account status
  createdBy: ObjectId;             // Reference to creator admin
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

**Indexes**:
- `email: 1` (unique)
- `role: 1`
- `isActive: 1`
- `createdAt: -1`

**Relationships**:
- `createdBy` → AdminUser (self-reference)

### 2. Banner Model (Extended)
**Purpose**: Enhanced banner management system

```typescript
interface Banner {
  title: string;                  // Banner title
  description: string;            // Banner description
  imageUrl: string;                // Image URL
  targetUrl: string;               // Click target URL
  position: 'header' | 'sidebar' | 'footer' | 'homepage'; // Display position
  status: 'active' | 'inactive';    // Current status
  startDate: Date;                 // Display start date
  endDate: Date;                    // Display end date
  createdBy: ObjectId;             // Admin who created
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

**Indexes**:
- `position: 1`
- `status: 1`
- `startDate: 1`
- `endDate: 1`
- `createdAt: -1`

**Relationships**:
- `createdBy` → AdminUser

### 3. Notification Model (Extended)
**Purpose**: Enhanced notification system for both users and admins

```typescript
interface Notification {
  type: 'info' | 'warning' | 'error' | 'success'; // Notification type
  title: string;                  // Notification title
  message: string;                // Notification message
  targetId: ObjectId;             // Related entity ID
  targetType: string;              // Related entity type (e.g., 'order', 'product')
  read: boolean;                  // Read status
  userId: ObjectId;               // User who should receive (null for admin notifications)
  adminId: ObjectId;              // Admin who created (null for system notifications)
  createdBy: ObjectId;             // Admin who created
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

**Indexes**:
- `userId: 1, read: 1`
- `adminId: 1`
- `createdAt: -1`
- `type: 1`

**Relationships**:
- `userId` → User
- `adminId` → AdminUser
- `createdBy` → AdminUser

### 4. RecentView Model
**Purpose**: Track recently viewed products for personalized experience

```typescript
interface RecentView {
  userId: ObjectId;                // User who viewed
  productId: ObjectId;             // Product that was viewed
  viewedAt: Date;                  // View timestamp
  session: string;                 // Session identifier
  ipAddress: string;               // IP address for analytics
  userAgent: string;               // User agent for device info
}
```

**Indexes**:
- `userId: 1, viewedAt: -1` (for user's recent views)
- `productId: 1, viewedAt: -1` (for product popularity)
- `session: 1` (for session-based tracking)
- `viewedAt: -1` (for recent activity)

**Relationships**:
- `userId` → User
- `productId` → Product

### 5. StockNotification Model
**Purpose**: Stock notification system for low inventory alerts

```typescript
interface StockNotification {
  productId: ObjectId;             // Product with low stock
  currentStock: number;            // Current stock level
  threshold: number;                // Stock threshold that triggered notification
  notifiedAdmins: ObjectId[];      // Admins who were notified
  lastNotification: Date;           // Last notification timestamp
  frequency: 'immediate' | 'daily' | 'weekly'; // Notification frequency
  isActive: boolean;               // Whether notification is active
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

**Indexes**:
- `productId: 1`
- `isActive: 1`
- `lastNotification: 1`

**Relationships**:
- `productId` → Product
- `notifiedAdmins` → AdminUser

## Extended Existing Models

### User Model Extensions
**Purpose**: Add admin-specific user management features

```typescript
interface User {
  // Existing fields...
  isAdmin: boolean;                // Whether user has admin privileges
  adminNotes: string;              // Admin notes about the user
  lastActivity: Date;              // Last user activity timestamp
  totalSpent: number;              // Total amount spent by user
  orderCount: number;              // Total number of orders
  // New fields for admin management
  isActive: boolean;               // User account status
  verificationStatus: 'pending' | 'verified' | 'rejected'; // Verification status
  verificationDate: Date;           // Verification timestamp
  blockedReason: string;           // Reason for account block
}
```

**Indexes**:
- `isAdmin: 1`
- `isActive: 1`
- `verificationStatus: 1`
- `lastActivity: -1`

### Product Model Extensions
**Purpose**: Add admin-specific product management features

```typescript
interface Product {
  // Existing fields...
  // New fields for admin management
  minStockLevel: number;           // Minimum stock level for notifications
  maxDiscount: number;             // Maximum allowed discount percentage
  isFeatured: boolean;             // Whether product is featured
  featuredOrder: number;           // Order for featured products
  adminNotes: string;              // Admin notes about the product
  supplierId: ObjectId;            // Supplier reference
  costPrice: number;               // Cost price for profit calculation
  profitMargin: number;            // Target profit margin
}
```

**Indexes**:
- `isFeatured: 1, featuredOrder: 1`
- `minStockLevel: 1, stock: 1`
- `supplierId: 1`

### Order Model Extensions
**Purpose**: Add admin-specific order management features

```typescript
interface Order {
  // Existing fields...
  // New fields for admin management
  adminNotes: string;              // Admin notes about the order
  internalStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'; // Internal status
  assignedTo: ObjectId;            // Admin assigned to handle order
  priority: 'low' | 'medium' | 'high' | 'urgent'; // Order priority
  expectedDelivery: Date;           // Expected delivery date
  actualDelivery: Date;             // Actual delivery date
}
```

**Indexes**:
- `internalStatus: 1`
- `assignedTo: 1`
- `priority: 1`
- `expectedDelivery: 1`

## Database Relationships

### Core Relationships
```
AdminUser
├── createdBanners → Banner (1:N)
├── createdNotifications → Notification (1:N)
├── createdUsers → User (1:N)
└── assignedOrders → Order (1:N)

User
├── recentViews → RecentView (1:N)
├── notifications → Notification (1:N)
└── orders → Order (1:N)

Product
├── recentViews → RecentView (1:N)
├── stockNotifications → StockNotification (1:N)
└── orders → Order (N:N via order items)

Order
├── user → User (1:1)
├── assignedAdmin → AdminUser (1:1)
└── items → Product (N:N via order items)

Banner
└── createdBy → AdminUser (1:1)

Notification
├── user → User (1:1)
├── admin → AdminUser (1:1)
└── createdBy → AdminUser (1:1)

RecentView
├── user → User (1:1)
└── product → Product (1:1)

StockNotification
├── product → Product (1:1)
└── notifiedAdmins → AdminUser (N:N)
```

## Database Indexes Strategy

### Performance Indexes
1. **User queries**: `email: 1`, `isActive: 1`, `createdAt: -1`
2. **Product queries**: `category: 1`, `price: 1`, `stock: 1`, `isFeatured: 1`
3. **Order queries**: `status: 1`, `createdAt: -1`, `user: 1`
4. **Admin queries**: `role: 1`, `isActive: 1`, `lastLogin: -1`

### Analytics Indexes
1. **Recent views**: `userId: 1, viewedAt: -1`, `productId: 1, viewedAt: -1`
2. **Notifications**: `userId: 1, read: 1, createdAt: -1`
3. **Stock alerts**: `productId: 1, isActive: 1`

### Search Indexes
1. **Text search**: Compound text index on product names and descriptions
2. **Geospatial**: For location-based features (if needed)

## Database Migration Strategy

### Phase 1: Schema Extensions
1. Add new collections: `adminUsers`, `stockNotifications`, `recentViews`
2. Extend existing collections with new fields
3. Create necessary indexes

### Phase 2: Data Population
1. Migrate existing banner data to extended model
2. Set up default admin user
3. Initialize stock notification thresholds

### Phase 3: Optimization
1. Analyze query performance
2. Add additional indexes as needed
3. Optimize data models based on usage patterns

## Security Considerations

### Data Access Control
- Admin users can only access data they have permissions for
- Sensitive data (passwords, payment info) is never exposed to admins
- Audit logging for all admin data access

### Data Validation
- Schema validation for all models
- Input sanitization for admin forms
- Rate limiting for admin API endpoints

### Backup Strategy
- Regular database backups
- Point-in-time recovery capability
- Data retention policies for analytics data

This database schema provides a robust foundation for the admin panel while maintaining compatibility with the existing e-commerce system and ensuring scalability for future growth.
