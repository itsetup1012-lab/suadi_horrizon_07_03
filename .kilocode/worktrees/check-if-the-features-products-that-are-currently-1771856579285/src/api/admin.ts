import api from './api';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  monthlyRevenue: any[];
}

export interface User {
  _id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  image?: string;
  inStock: boolean;
  createdAt: string;
}

export interface Order {
  _id: string;
  user: { email: string };
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  shippingAddress?: {
    city?: string;
    country?: string;
  };
}

// Admin Stats API
export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// Users API
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserRole = async (userId: string, role: string): Promise<User> => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const updateUserStatus = async (userId: string, isActive: boolean): Promise<User> => {
  const response = await api.put(`/admin/users/${userId}/status`, { isActive });
  return response.data;
};

export const bulkUpdateUsers = async (userIds: string[], updateData: any) => {
  const response = await api.put('/admin/users/bulk', { userIds, updateData });
  return response.data;
};

export const exportUsers = async (userIds?: string[]) => {
  const params = userIds ? { userIds: userIds.join(',') } : {};
  const response = await api.get('/admin/users/export', { params });
  return response.data;
};

// Products API
export const getAdminProducts = async (): Promise<Product[]> => {
  const response = await api.get('/admin/products');
  return response.data;
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  const response = await api.post('/admin/products', productData);
  return response.data;
};

export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product> => {
  const response = await api.put(`/admin/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await api.delete(`/admin/products/${productId}`);
};

export const bulkDeleteProducts = async (productIds: string[]) => {
  const response = await api.delete('/admin/products/bulk', { data: { productIds } });
  return response.data;
};

export const exportProducts = async (productIds?: string[]) => {
  const params = productIds ? { productIds: productIds.join(',') } : {};
  const response = await api.get('/admin/products/export', { params });
  return response.data;
};

// Orders API
export const getAdminOrders = async (): Promise<Order[]> => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
  const response = await api.put(`/admin/orders/${orderId}/status`, { status });
  return response.data;
};

export const exportOrders = async (orderIds?: string[]) => {
  const params = orderIds ? { orderIds: orderIds.join(',') } : {};
  const response = await api.get('/admin/orders/export', { params });
  return response.data;
};