# Admin Panel Project Structure Plan

## Overview
This plan extends the existing Next.js e-commerce project to include a comprehensive admin panel with authentication, user management, and advanced e-commerce features.

## Current Project Analysis
- **Base Framework**: Next.js 16.1.6 with App Router
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with refresh tokens
- **UI Framework**: Tailwind CSS with Radix UI components
- **Payment**: Stripe integration
- **State Management**: React Context/Server Components

## Proposed Project Structure

### 1. Directory Structure
```
src/
├── app/
│   ├── (admin)/                    # Admin panel routes
│   │   ├── layout.tsx              # Admin global layout
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── (users)/                # User management
│   │   │   ├── page.tsx            # User list
│   │   │   ├── [id]/              # User details
│   │   │   └── [id]/edit.tsx       # User edit
│   │   ├── (products)/             # Product management
│   │   │   ├── page.tsx            # Product list
│   │   │   ├── [id]/              # Product details
│   │   │   ├── [id]/edit.tsx       # Product edit
│   │   │   └── create.tsx          # Create product
│   │   ├── (orders)/               # Order management
│   │   │   ├── page.tsx            # Order list
│   │   │   ├── [id]/              # Order details
│   │   │   └── [id]/edit.tsx       # Order edit
│   │   ├── (analytics)/           # Analytics dashboard
│   │   │   ├── page.tsx            # Main analytics
│   │   │   ├── sales.tsx           # Sales analytics
│   │   │   ├── inventory.tsx        # Inventory analytics
│   │   │   └── users.tsx           # User analytics
│   │   ├── (settings)/             # Admin settings
│   │   │   ├── page.tsx            # General settings
│   │   │   ├── users.tsx           # User management settings
│   │   │   ├── products.tsx        # Product settings
│   │   │   └── notifications.tsx    # Notification settings
│   │   ├── (banners)/             # Banner management
│   │   │   ├── page.tsx            # Banner list
│   │   │   ├── [id]/              # Banner details
│   │   │   └── create.tsx          # Create banner
│   │   └── (reports)/              # Reports and exports
│   │       ├── page.tsx            # Reports overview
│   │       ├── sales.tsx           # Sales reports
│   │       ├── inventory.tsx        # Inventory reports
│   │       └── users.tsx           # User reports
├── components/
│   ├── admin/                      # Admin-specific components
│   │   ├── AdminLayout.tsx         # Admin layout wrapper
│   │   ├── AdminSidebar.tsx        # Navigation sidebar
│   │   ├── AdminHeader.tsx         # Admin header
│   │   ├── AdminTable.tsx          # Data table component
│   │   ├── AdminCard.tsx           # Admin card component
│   │   ├── AdminForm.tsx            # Admin form wrapper
│   │   ├── UserCard.tsx            # User card component
│   │   ├── ProductCard.tsx         # Product card component
│   │   ├── OrderCard.tsx           # Order card component
│   │   └── AnalyticsCard.tsx       # Analytics card component
├── lib/
│   ├── db/
│   │   ├── models/                 # Database models
│   │   │   ├── AdminUser.ts        # Admin user model
│   │   │   ├── Banner.ts           # Banner model
│   │   │   ├── Notification.ts    # Notification model
│   │   │   └── RecentView.ts       # Recent view model
│   │   └── adminAuth.ts            # Admin authentication
│   ├── admin/                      # Admin utilities
│   │   ├── permissions.ts          # Permission system
│   │   ├── audit.ts                # Audit logging
│   │   └── notifications.ts        # Notification system
├── hooks/
│   └── useAdminAuth.ts             # Admin authentication hook
├── types/
│   └── admin.ts                    # Admin-specific types
└── styles/
    └── admin/                      # Admin-specific styles
        ├── admin-layout.css
        ├── admin-sidebar.css
        └── admin-table.css
```

### 2. Database Schema Extensions

#### AdminUser Model
```typescript
interface AdminUser {
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'moderator';
  permissions: string[]; // Array of permission strings
  lastLogin: Date;
  isActive: boolean;
  createdBy: ObjectId; // Reference to creator admin
  createdAt: Date;
  updatedAt: Date;
}
```

#### Banner Model
```typescript
interface Banner {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  position: 'header' | 'sidebar' | 'footer' | 'homepage';
  status: 'active' | 'inactive';
  startDate: Date;
  endDate: Date;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Notification Model
```typescript
interface Notification {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  targetId: ObjectId; // Related entity ID
  targetType: string; // Related entity type
  read: boolean;
  userId: ObjectId; // User who should receive
  createdBy: ObjectId; // Admin who created
  createdAt: Date;
  updatedAt: Date;
}
```

#### RecentView Model
```typescript
interface RecentView {
  userId: ObjectId;
  productId: ObjectId;
  viewedAt: Date;
  session: string; // Session identifier
}
```

### 3. API Route Extensions

#### Admin Authentication Routes
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/me` - Get current admin
- `POST /api/admin/auth/refresh` - Refresh token

#### Admin User Management Routes
- `GET /api/admin/users` - List users with pagination
- `POST /api/admin/users` - Create user
- `GET /api/admin/users/[id]` - Get user details
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `POST /api/admin/users/[id]/activate` - Activate user
- `POST /api/admin/users/[id]/deactivate` - Deactivate user

#### Admin Product Management Routes
- `GET /api/admin/products` - List products with pagination
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get product details
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/products/[id]/stock` - Update stock
- `POST /api/admin/products/[id]/price` - Update price

#### Admin Order Management Routes
- `GET /api/admin/orders` - List orders with pagination
- `GET /api/admin/orders/[id]` - Get order details
- `PUT /api/admin/orders/[id]` - Update order status
- `POST /api/admin/orders/[id]/ship` - Mark as shipped
- `POST /api/admin/orders/[id]/cancel` - Cancel order

#### Admin Banner Management Routes
- `GET /api/admin/banners` - List banners
- `POST /api/admin/banners` - Create banner
- `GET /api/admin/banners/[id]` - Get banner details
- `PUT /api/admin/banners/[id]` - Update banner
- `DELETE /api/admin/banners/[id]` - Delete banner

#### Admin Analytics Routes
- `GET /api/admin/analytics/dashboard` - Dashboard stats
- `GET /api/admin/analytics/sales` - Sales analytics
- `GET /api/admin/analytics/users` - User analytics
- `GET /api/admin/analytics/inventory` - Inventory analytics

### 4. Component Architecture

#### Admin Layout Components
1. **AdminLayout.tsx** - Main admin layout with sidebar and header
2. **AdminSidebar.tsx** - Navigation sidebar with collapsible sections
3. **AdminHeader.tsx** - Top header with user info and notifications
4. **AdminContent.tsx** - Main content area with breadcrumbs

#### Data Display Components
1. **AdminTable.tsx** - Reusable table component with sorting and pagination
2. **AdminCard.tsx** - Card component for displaying data
3. **UserCard.tsx** - User information card
4. **ProductCard.tsx** - Product information card
5. **OrderCard.tsx** - Order information card

#### Form Components
1. **AdminForm.tsx** - Form wrapper with validation
2. **UserForm.tsx** - User creation/editing form
3. **ProductForm.tsx** - Product creation/editing form
4. **OrderForm.tsx** - Order management form

#### Analytics Components
1. **AnalyticsCard.tsx** - Card for displaying analytics data
2. **SalesChart.tsx** - Sales chart component
3. **InventoryChart.tsx** - Inventory chart component
4. **UserChart.tsx** - User analytics chart

### 5. Authentication Flow Design

#### Admin Authentication Flow
1. **Login Page** - `/admin/login`
   - Email and password input
   - Remember me option
   - Forgot password link
   - Redirect to dashboard on success

2. **Token Management**
   - Access token (15 minutes)
   - Refresh token (7 days)
   - Automatic token refresh
   - Token revocation on logout

3. **Protected Routes**
   - Middleware to verify admin authentication
   - Role-based access control
   - Permission-based feature access

4. **Session Management**
   - Single session per admin
   - Session timeout handling
   - Concurrent session prevention

### 6. Permission System

#### Role-Based Permissions
```typescript
interface Permissions {
  // User Management
  'users.read': boolean;
  'users.create': boolean;
  'users.update': boolean;
  'users.delete': boolean;
  
  // Product Management
  'products.read': boolean;
  'products.create': boolean;
  'products.update': boolean;
  'products.delete': boolean;
  
  // Order Management
  'orders.read': boolean;
  'orders.update': boolean;
  
  // Analytics
  'analytics.read': boolean;
  
  // Settings
  'settings.read': boolean;
  'settings.update': boolean;
  
  // Banners
  'banners.read': boolean;
  'banners.create': boolean;
  'banners.update': boolean;
  'banners.delete': boolean;
}
```

#### Permission Levels
- **Super Admin**: All permissions
- **Admin**: Most permissions except user management
- **Moderator**: Read-only access to most features

### 7. Global Layout Integration

The admin panel will have its own global layout that integrates with the existing layout system:

#### Admin Layout Structure
```typescript
// Admin layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### Responsive Design
- Desktop: Full sidebar with navigation
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation with hamburger menu

### 8. Feature Implementation Priority

#### Phase 1: Core Admin Panel
1. Admin authentication system
2. User management interface
3. Product management interface
4. Order management interface
5. Basic analytics dashboard

#### Phase 2: Advanced Features
1. Banner management system
2. Notification system
3. Recent viewed products
4. Stock notification system
5. Advanced analytics

#### Phase 3: Optimization & Polish
1. Performance optimization
2. Advanced search and filtering
3. Bulk operations
4. Export functionality
5. Advanced permissions

### 9. Integration with Existing Features

The admin panel will integrate seamlessly with existing features:

#### E-commerce Integration
- Product management integrates with existing product system
- Order management connects to existing order system
- User management extends existing user system

#### Analytics Integration
- Leverages existing analytics data
- Provides admin-specific insights
- Integrates with Stripe for payment analytics

#### Notification Integration
- Extends existing notification system
- Adds admin-specific notifications
- Integrates with email/SMS systems

### 10. Technical Considerations

#### Performance
- Server-side rendering for admin pages
- Database indexing for admin queries
- Caching for frequently accessed data
- Lazy loading for large datasets

#### Security
- Role-based access control
- Input validation and sanitization
- Rate limiting for admin endpoints
- Audit logging for all admin actions

#### Scalability
- Microservices architecture for large-scale deployments
- Database sharding for large datasets
- CDN integration for static assets
- Load balancing for high traffic

This project structure provides a solid foundation for building a comprehensive admin panel that integrates seamlessly with the existing e-commerce platform while maintaining scalability, security, and maintainability.
## Overview
This plan extends the existing Next.js e-commerce project to include a comprehensive admin panel with authentication, user management, and advanced e-commerce features.

## Current Project Analysis
- **Base Framework**: Next.js 16.1.6 with App Router
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with refresh tokens
- **UI Framework**: Tailwind CSS with Radix UI components
- **Payment**: Stripe integration
- **State Management**: React Context/Server Components

## Proposed Project Structure

### 1. Directory Structure
```
src/
├── app/
│   ├── (admin)/                    # Admin panel routes
│   │   ├── layout.tsx              # Admin global layout
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── (users)/                # User management
│   │   │   ├── page.tsx            # User list
│   │   │   ├── [id]/              # User details
│   │   │   └── [id]/edit.tsx       # User edit
│   │   ├── (products)/             # Product management
│   │   │   ├── page.tsx            # Product list
│   │   │   ├── [id]/              # Product details
│   │   │   ├── [id]/edit.tsx       # Product edit
│   │   │   └── create.tsx          # Create product
│   │   ├── (orders)/               # Order management
│   │   │   ├── page.tsx            # Order list
│   │   │   ├── [id]/              # Order details
│   │   │   └── [id]/edit.tsx       # Order edit
│   │   ├── (analytics)/           # Analytics dashboard
│   │   │   ├── page.tsx            # Main analytics
│   │   │   ├── sales.tsx           # Sales analytics
│   │   │   ├── inventory.tsx        # Inventory analytics
│   │   │   └── users.tsx           # User analytics
│   │   ├── (settings)/             # Admin settings
│   │   │   ├── page.tsx            # General settings
│   │   │   ├── users.tsx           # User management settings
│   │   │   ├── products.tsx        # Product settings
│   │   │   └── notifications.tsx    # Notification settings
│   │   ├── (banners)/             # Banner management
│   │   │   ├── page.tsx            # Banner list
│   │   │   ├── [id]/              # Banner details
│   │   │   └── create.tsx          # Create banner
│   │   └── (reports)/              # Reports and exports
│   │       ├── page.tsx            # Reports overview
│   │       ├── sales.tsx           # Sales reports
│   │       ├── inventory.tsx        # Inventory reports
│   │       └── users.tsx           # User reports
├── components/
│   ├── admin/                      # Admin-specific components
│   │   ├── AdminLayout.tsx         # Admin layout wrapper
│   │   ├── AdminSidebar.tsx        # Navigation sidebar
│   │   ├── AdminHeader.tsx         # Admin header
│   │   ├── AdminTable.tsx          # Data table component
│   │   ├── AdminCard.tsx           # Admin card component
│   │   ├── AdminForm.tsx            # Admin form wrapper
│   │   ├── UserCard.tsx            # User card component
│   │   ├── ProductCard.tsx         # Product card component
│   │   ├── OrderCard.tsx           # Order card component
│   │   └── AnalyticsCard.tsx       # Analytics card component
├── lib/
│   ├── db/
│   │   ├── models/                 # Database models
│   │   │   ├── AdminUser.ts        # Admin user model
│   │   │   ├── Banner.ts           # Banner model
│   │   │   ├── Notification.ts    # Notification model
│   │   │   └── RecentView.ts       # Recent view model
│   │   └── adminAuth.ts            # Admin authentication
│   ├── admin/                      # Admin utilities
│   │   ├── permissions.ts          # Permission system
│   │   ├── audit.ts                # Audit logging
│   │   └── notifications.ts        # Notification system
├── hooks/
│   └── useAdminAuth.ts             # Admin authentication hook
├── types/
│   └── admin.ts                    # Admin-specific types
└── styles/
    └── admin/                      # Admin-specific styles
        ├── admin-layout.css
        ├── admin-sidebar.css
        └── admin-table.css
```

### 2. Database Schema Extensions

#### AdminUser Model
```typescript
interface AdminUser {
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'moderator';
  permissions: string[]; // Array of permission strings
  lastLogin: Date;
  isActive: boolean;
  createdBy: ObjectId; // Reference to creator admin
  createdAt: Date;
  updatedAt: Date;
}
```

#### Banner Model
```typescript
interface Banner {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  position: 'header' | 'sidebar' | 'footer' | 'homepage';
  status: 'active' | 'inactive';
  startDate: Date;
  endDate: Date;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Notification Model
```typescript
interface Notification {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  targetId: ObjectId; // Related entity ID
  targetType: string; // Related entity type
  read: boolean;
  userId: ObjectId; // User who should receive
  createdBy: ObjectId; // Admin who created
  createdAt: Date;
  updatedAt: Date;
}
```

#### RecentView Model
```typescript
interface RecentView {
  userId: ObjectId;
  productId: ObjectId;
  viewedAt: Date;
  session: string; // Session identifier
}
```

### 3. API Route Extensions

#### Admin Authentication Routes
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/me` - Get current admin
- `POST /api/admin/auth/refresh` - Refresh token

#### Admin User Management Routes
- `GET /api/admin/users` - List users with pagination
- `POST /api/admin/users` - Create user
- `GET /api/admin/users/[id]` - Get user details
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `POST /api/admin/users/[id]/activate` - Activate user
- `POST /api/admin/users/[id]/deactivate` - Deactivate user

#### Admin Product Management Routes
- `GET /api/admin/products` - List products with pagination
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get product details
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/products/[id]/stock` - Update stock
- `POST /api/admin/products/[id]/price` - Update price

#### Admin Order Management Routes
- `GET /api/admin/orders` - List orders with pagination
- `GET /api/admin/orders/[id]` - Get order details
- `PUT /api/admin/orders/[id]` - Update order status
- `POST /api/admin/orders/[id]/ship` - Mark as shipped
- `POST /api/admin/orders/[id]/cancel` - Cancel order

#### Admin Banner Management Routes
- `GET /api/admin/banners` - List banners
- `POST /api/admin/banners` - Create banner
- `GET /api/admin/banners/[id]` - Get banner details
- `PUT /api/admin/banners/[id]` - Update banner
- `DELETE /api/admin/banners/[id]` - Delete banner

#### Admin Analytics Routes
- `GET /api/admin/analytics/dashboard` - Dashboard stats
- `GET /api/admin/analytics/sales` - Sales analytics
- `GET /api/admin/analytics/users` - User analytics
- `GET /api/admin/analytics/inventory` - Inventory analytics

### 4. Component Architecture

#### Admin Layout Components
1. **AdminLayout.tsx** - Main admin layout with sidebar and header
2. **AdminSidebar.tsx** - Navigation sidebar with collapsible sections
3. **AdminHeader.tsx** - Top header with user info and notifications
4. **AdminContent.tsx** - Main content area with breadcrumbs

#### Data Display Components
1. **AdminTable.tsx** - Reusable table component with sorting and pagination
2. **AdminCard.tsx** - Card component for displaying data
3. **UserCard.tsx** - User information card
4. **ProductCard.tsx** - Product information card
5. **OrderCard.tsx** - Order information card

#### Form Components
1. **AdminForm.tsx** - Form wrapper with validation
2. **UserForm.tsx** - User creation/editing form
3. **ProductForm.tsx** - Product creation/editing form
4. **OrderForm.tsx** - Order management form

#### Analytics Components
1. **AnalyticsCard.tsx** - Card for displaying analytics data
2. **SalesChart.tsx** - Sales chart component
3. **InventoryChart.tsx** - Inventory chart component
4. **UserChart.tsx** - User analytics chart

### 5. Authentication Flow Design

#### Admin Authentication Flow
1. **Login Page** - `/admin/login`
   - Email and password input
   - Remember me option
   - Forgot password link
   - Redirect to dashboard on success

2. **Token Management**
   - Access token (15 minutes)
   - Refresh token (7 days)
   - Automatic token refresh
   - Token revocation on logout

3. **Protected Routes**
   - Middleware to verify admin authentication
   - Role-based access control
   - Permission-based feature access

4. **Session Management**
   - Single session per admin
   - Session timeout handling
   - Concurrent session prevention

### 6. Permission System

#### Role-Based Permissions
```typescript
interface Permissions {
  // User Management
  'users.read': boolean;
  'users.create': boolean;
  'users.update': boolean;
  'users.delete': boolean;
  
  // Product Management
  'products.read': boolean;
  'products.create': boolean;
  'products.update': boolean;
  'products.delete': boolean;
  
  // Order Management
  'orders.read': boolean;
  'orders.update': boolean;
  
  // Analytics
  'analytics.read': boolean;
  
  // Settings
  'settings.read': boolean;
  'settings.update': boolean;
  
  // Banners
  'banners.read': boolean;
  'banners.create': boolean;
  'banners.update': boolean;
  'banners.delete': boolean;
}
```

#### Permission Levels
- **Super Admin**: All permissions
- **Admin**: Most permissions except user management
- **Moderator**: Read-only access to most features

### 7. Global Layout Integration

The admin panel will have its own global layout that integrates with the existing layout system:

#### Admin Layout Structure
```typescript
// Admin layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### Responsive Design
- Desktop: Full sidebar with navigation
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation with hamburger menu

### 8. Feature Implementation Priority

#### Phase 1: Core Admin Panel
1. Admin authentication system
2. User management interface
3. Product management interface
4. Order management interface
5. Basic analytics dashboard

#### Phase 2: Advanced Features
1. Banner management system
2. Notification system
3. Recent viewed products
4. Stock notification system
5. Advanced analytics

#### Phase 3: Optimization & Polish
1. Performance optimization
2. Advanced search and filtering
3. Bulk operations
4. Export functionality
5. Advanced permissions

### 9. Integration with Existing Features

The admin panel will integrate seamlessly with existing features:

#### E-commerce Integration
- Product management integrates with existing product system
- Order management connects to existing order system
- User management extends existing user system

#### Analytics Integration
- Leverages existing analytics data
- Provides admin-specific insights
- Integrates with Stripe for payment analytics

#### Notification Integration
- Extends existing notification system
- Adds admin-specific notifications
- Integrates with email/SMS systems

### 10. Technical Considerations

#### Performance
- Server-side rendering for admin pages
- Database indexing for admin queries
- Caching for frequently accessed data
- Lazy loading for large datasets

#### Security
- Role-based access control
- Input validation and sanitization
- Rate limiting for admin endpoints
- Audit logging for all admin actions

#### Scalability
- Microservices architecture for large-scale deployments
- Database sharding for large datasets
- CDN integration for static assets
- Load balancing for high traffic

This project structure provides a solid foundation for building a comprehensive admin panel that integrates seamlessly with the existing e-commerce platform while maintaining scalability, security, and maintainability.
