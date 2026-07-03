import { Schema, model, Document } from 'mongoose';

export interface RecentlyViewedProduct extends Document {
  userId: string;
  productId: string;
  viewedAt: Date;
  ipAddress?: string;
}

export interface StockAlert extends Document {
  productId: string;
  userId: string;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  lastNotified?: Date;
}

export interface Banner extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  position: 'top' | 'bottom' | 'sidebar' | 'modal';
  displayOrder: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  targetAudience?: 'all' | 'new_users' | 'returning_users' | 'specific_users';
  targetUserIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const recentlyViewedProductSchema = new Schema<RecentlyViewedProduct>({
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  viewedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
}, {
  timestamps: true,
  collection: 'recently_viewed_products',
});

const stockAlertSchema = new Schema<StockAlert>({
  productId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  email: { type: String, required: true },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  lastNotified: { type: Date },
}, {
  timestamps: true,
  collection: 'stock_alerts',
});

const bannerSchema = new Schema<Banner>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  linkUrl: { type: String },
  position: { 
    type: String, 
    enum: ['top', 'bottom', 'sidebar', 'modal'], 
    default: 'top' 
  },
  displayOrder: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  targetAudience: { 
    type: String, 
    enum: ['all', 'new_users', 'returning_users', 'specific_users'] 
  },
  targetUserIds: [{ type: String }],
}, {
  timestamps: true,
  collection: 'banners',
});

export const RecentlyViewedProductModel = model<RecentlyViewedProduct>('RecentlyViewedProduct', recentlyViewedProductSchema);
export const StockAlertModel = model<StockAlert>('StockAlert', stockAlertSchema);
export const BannerModel = model<Banner>('Banner', bannerSchema);
