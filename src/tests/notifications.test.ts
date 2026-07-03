import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { request, TestResponse } from 'supertest';
import { app } from '@/app';
import { RecentlyViewedProductModel, StockAlertModel, BannerModel } from '@/lib/database/schemas/notifications';
import { UserModel } from '@/lib/database/schemas';

describe('Notification Features', () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    // Create test user
    testUser = await UserModel.create({
      email: 'test@example.com',
      password: '$2b$10$dummyhash', // Hashed password
      name: 'Test User',
    });

    // Get auth token
    const authResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password',
      });

    authToken = authResponse.body.token;
  });

  afterEach(async () => {
    // Clean up
    await RecentlyViewedProductModel.deleteMany({});
    await StockAlertModel.deleteMany({});
    await BannerModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  describe('Recently Viewed Products', () => {
    it('should track viewed product', async () => {
      const productId = 'test-product-123';

      const response = await request(app)
        .post('/api/notifications/recently-viewed')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const viewedProduct = await RecentlyViewedProductModel.findOne({ 
        userId: testUser._id,
        productId 
      });
      expect(viewedProduct).toBeDefined();
      expect(viewedProduct?.productId).toBe(productId);
    });

    it('should return viewed products', async () => {
      // Create test data
      await RecentlyViewedProductModel.create([
        { userId: testUser._id, productId: 'prod-1' },
        { userId: testUser._id, productId: 'prod-2' },
        { userId: testUser._id, productId: 'prod-3' },
      ]);

      const response = await request(app)
        .get('/api/notifications/recently-viewed')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should handle unauthorized access', async () => {
      const response = await request(app)
        .post('/api/notifications/recently-viewed')
        .send({ productId: 'test' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('Stock Alerts', () => {
    it('should create stock alert', async () => {
      const productId = 'test-product-456';
      const email = 'test@example.com';

      const response = await request(app)
        .post('/api/notifications/stock-alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId, email });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const alert = await StockAlertModel.findOne({ 
        userId: testUser._id,
        productId 
      });
      expect(alert).toBeDefined();
      expect(alert?.email).toBe(email);
    });

    it('should return stock alerts', async () => {
      // Create test data
      await StockAlertModel.create([
        { userId: testUser._id, productId: 'prod-1', email: 'test@example.com' },
        { userId: testUser._id, productId: 'prod-2', email: 'test@example.com' },
      ]);

      const response = await request(app)
        .get('/api/notifications/stock-alerts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should delete stock alert', async () => {
      const alert = await StockAlertModel.create({
        userId: testUser._id,
        productId: 'prod-to-delete',
        email: 'test@example.com',
      });

      const response = await request(app)
        .delete(`/api/notifications/stock-alerts?productId=${alert.productId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedAlert = await StockAlertModel.findById(alert._id);
      expect(deletedAlert?.isActive).toBe(false);
    });
  });

  describe('Banners', () => {
    it('should create banner', async () => {
      const bannerData = {
        title: 'Test Banner',
        content: 'This is a test banner',
        position: 'top',
        displayOrder: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      };

      const response = await request(app)
        .post('/api/notifications/banners')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bannerData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.banner).toBeDefined();
      expect(response.body.banner.title).toBe(bannerData.title);
    });

    it('should return active banners', async () => {
      // Create test data
      await BannerModel.create([
        {
          title: 'Active Banner',
          content: 'Active content',
          position: 'top',
          displayOrder: 1,
          startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
        {
          title: 'Inactive Banner',
          content: 'Inactive content',
          position: 'bottom',
          displayOrder: 2,
          startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          endDate: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
          isActive: false,
        },
      ]);

      const response = await request(app)
        .get('/api/notifications/banners')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1); // Only active banner should be returned
    });

    it('should update banner', async () => {
      const banner = await BannerModel.create({
        title: 'Original Title',
        content: 'Original content',
        position: 'top',
        displayOrder: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      });

      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const response = await request(app)
        .put(`/api/notifications/banners?id=${banner._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.banner.title).toBe(updateData.title);
    });

    it('should delete banner', async () => {
      const banner = await BannerModel.create({
        title: 'Banner to delete',
        content: 'Content',
        position: 'top',
        displayOrder: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      });

      const response = await request(app)
        .delete(`/api/notifications/banners?id=${banner._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedBanner = await BannerModel.findById(banner._id);
      expect(deletedBanner).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing required fields', async () => {
      // Test missing product ID for recently viewed
      const response1 = await request(app)
        .post('/api/notifications/recently-viewed')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response1.status).toBe(400);
      expect(response1.body.error).toBe('Product ID is required');

      // Test missing fields for stock alert
      const response2 = await request(app)
        .post('/api/notifications/stock-alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response2.status).toBe(400);
      expect(response2.body.error).toBe('Product ID and email are required');

      // Test missing required fields for banner
      const response3 = await request(app)
        .post('/api/notifications/banners')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response3.status).toBe(400);
      expect(response3.body.error).toContain('Title, content, start date, and end date are required');
    });

    it('should handle invalid dates', async () => {
      const bannerData = {
        title: 'Test Banner',
        content: 'Test content',
        position: 'top',
        displayOrder: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Past date
        isActive: true,
      };

      const response = await request(app)
        .post('/api/notifications/banners')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bannerData);

      // Should still create banner but it won't be returned as active
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});import { request, TestResponse } from 'supertest';
import { app } from '@/app';
import { RecentlyViewedProductModel, StockAlertModel, BannerModel } from '@/lib/database/schemas/notifications';
import { UserModel } from '@/lib/database/schemas';

describe('Notification Features', () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    // Create test user
    testUser = await UserModel.create({
      email: 'test@example.com',
      password: '$2b$10$dummyhash', // Hashed password
      name: 'Test User',
    });

    // Get auth token
    const authResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password',
      });

    authToken = authResponse.body.token;
  });

  afterEach(async () => {
    // Clean up
    await RecentlyViewedProductModel.deleteMany({});
    await StockAlertModel.deleteMany({});
    await BannerModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  describe('Recently Viewed Products', () => {
    it('should track viewed product', async () => {
      const productId = 'test-product-123';

      const response = await request(app)
        .post('/api/notifications/recently-viewed')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const viewedProduct = await RecentlyViewedProductModel.findOne({ 
        userId: testUser._id,
        productId 
      });
      expect(viewedProduct).toBeDefined();
      expect(viewedProduct?.productId).toBe(productId);
    });

    it('should return viewed products', async () => {
      // Create test data
      await RecentlyViewedProductModel.create([
        { userId: testUser._id, productId: 'prod-1' },
        { userId: testUser._id, productId: 'prod-2' },
        { userId: testUser._id, productId: 'prod-3' },
      ]);

      const response = await request(app)
        .get('/api/notifications/recently-viewed')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should handle unauthorized access', async () => {
      const response = await request(app)
        .post('/api/notifications/recently-viewed')
        .send({ productId: 'test' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('Stock Alerts', () => {
    it('should create stock alert', async () => {
      const productId = 'test-product-456';
      const email = 'test@example.com';

      const response = await request(app)
        .post('/api/notifications/stock-alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId, email });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const alert = await StockAlertModel.findOne({ 
        userId: testUser._id,
        productId 
      });
      expect(alert).toBeDefined();
      expect(alert?.email).toBe(email);
    });

    it('should return stock alerts', async () => {
      // Create test data
      await StockAlertModel.create([
        { userId: testUser._id, productId: 'prod-1', email: 'test@example.com' },
        { userId: testUser._id, productId: 'prod-2', email: 'test@example.com' },
      ]);

      const response = await request(app)
        .get('/api/notifications/stock-alerts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should delete stock alert', async () => {
      const alert = await StockAlertModel.create({
        userId: testUser._id,
        productId: 'prod-to-delete',
        email: 'test@example.com',
      });

      const response = await request(app)
        .delete(`/api/notifications/stock-alerts?productId=${alert.productId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedAlert = await StockAlertModel.findById(alert._id);
      expect(deletedAlert?.isActive).toBe(false);
    });
  });

  describe('Banners', () => {
    it('should create banner', async () => {
      const bannerData = {
        title: 'Test Banner',
        content: 'This is a test banner',
        position: 'top',
        displayOrder: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      };

      const response = await request(app)
        .post('/api/notifications/banners')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bannerData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.banner).toBeDefined();
      expect(response.body.banner.title).toBe(bannerData.title);
    });

    it('should return active banners', async () => {
      // Create test data
      await BannerModel.create([
        {
          title: 'Active Banner',
          content: 'Active content',
          position: 'top',
          displayOrder: 1,
          startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
        {
          title: 'Inactive Banner',
          content: 'Inactive content',
          position: 'bottom',
          displayOrder: 2,
          startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          endDate: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
          isActive: false,
        },
      ]);

      const response = await request(app)
        .get('/api/notifications/banners')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1); // Only active banner should be returned
    });

    it('should update banner', async () => {
      const banner = await BannerModel.create({
        title: 'Original Title',
        content: 'Original content',
        position: 'top',
        displayOrder: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      });

      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const response = await request(app)
        .put(`/api/notifications/banners?id=${banner._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.banner.title).toBe(updateData.title);
    });

    it('should delete banner', async () => {
      const banner = await BannerModel.create({
        title: 'Banner to delete',
        content: 'Content',
        position: 'top',
        displayOrder: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      });

      const response = await request(app)
        .delete(`/api/notifications/banners?id=${banner._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedBanner = await BannerModel.findById(banner._id);
      expect(deletedBanner).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing required fields', async () => {
      // Test missing product ID for recently viewed
      const response1 = await request(app)
        .post('/api/notifications/recently-viewed')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response1.status).toBe(400);
      expect(response1.body.error).toBe('Product ID is required');

      // Test missing fields for stock alert
      const response2 = await request(app)
        .post('/api/notifications/stock-alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response2.status).toBe(400);
      expect(response2.body.error).toBe('Product ID and email are required');

      // Test missing required fields for banner
      const response3 = await request(app)
        .post('/api/notifications/banners')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response3.status).toBe(400);
      expect(response3.body.error).toContain('Title, content, start date, and end date are required');
    });

    it('should handle invalid dates', async () => {
      const bannerData = {
        title: 'Test Banner',
        content: 'Test content',
        position: 'top',
        displayOrder: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Past date
        isActive: true,
      };

      const response = await request(app)
        .post('/api/notifications/banners')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bannerData);

      // Should still create banner but it won't be returned as active
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
