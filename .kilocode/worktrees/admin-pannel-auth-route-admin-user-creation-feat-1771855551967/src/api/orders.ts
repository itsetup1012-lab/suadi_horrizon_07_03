// Description: Order management functions
// Endpoint: POST /api/orders, GET /api/orders
// Request: { items: CartItem[], shippingInfo: ShippingInfo, paymentInfo: PaymentInfo }
// Response: { orderId: string, status: string, total: number }

export interface Order {
  _id: string;
  orderNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'Processing' | 'Shipped' | 'In Transit' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  shippingAddress: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

export const createOrder = (data: {
  items: Array<{ _id: string; name: string; quantity: number; price: number }>;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentInfo: {
    method: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  };
}): Promise<{ orderId: string; orderNumber: string; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderNumber = `ORD-${Date.now()}`;
      resolve({
        orderId: '1',
        orderNumber,
        total: 5000,
      });
    }, 800);
  });
};

export const getOrders = (): Promise<{ orders: Order[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          _id: '1',
          orderNumber: 'ORD-1234567890',
          date: '2024-01-15',
          items: [
            { name: 'Hydraulic Pump Assembly', quantity: 2, price: 2500 },
            { name: 'Engine Air Filter', quantity: 5, price: 150 },
          ],
          total: 5750,
          status: 'Delivered',
          paymentStatus: 'Completed',
          shippingAddress: '123 Business St, Dubai, UAE',
          estimatedDelivery: '2024-01-20',
          trackingNumber: 'TRACK-123456',
        },
        {
          _id: '2',
          orderNumber: 'ORD-1234567891',
          date: '2024-01-10',
          items: [
            { name: 'Transmission Fluid', quantity: 3, price: 85 },
          ],
          total: 255,
          status: 'In Transit',
          paymentStatus: 'Completed',
          shippingAddress: '456 Industrial Ave, Singapore',
          estimatedDelivery: '2024-01-25',
          trackingNumber: 'TRACK-123457',
        },
      ];

      resolve({ orders: mockOrders });
    }, 500);
  });
};

export const getOrderById = (id: string): Promise<Order> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order: Order = {
        _id: id,
        orderNumber: 'ORD-1234567890',
        date: '2024-01-15',
        items: [
          { name: 'Hydraulic Pump Assembly', quantity: 2, price: 2500 },
          { name: 'Engine Air Filter', quantity: 5, price: 150 },
        ],
        total: 5750,
        status: 'Delivered',
        paymentStatus: 'Completed',
        shippingAddress: '123 Business St, Dubai, UAE',
        estimatedDelivery: '2024-01-20',
        trackingNumber: 'TRACK-123456',
      };
      resolve(order);
    }, 300);
  });
};