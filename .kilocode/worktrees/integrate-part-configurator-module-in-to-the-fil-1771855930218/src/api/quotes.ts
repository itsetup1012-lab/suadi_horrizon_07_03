// Description: Quote request management
// Endpoint: POST /api/quotes, GET /api/quotes
// Request: { items: CartItem[], buyerInfo: BuyerInfo, notes: string }
// Response: { quoteId: string, referenceNumber: string }

export interface Quote {
  _id: string;
  referenceNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  status: 'Pending' | 'Responded' | 'Accepted' | 'Expired';
  buyerName: string;
  buyerEmail: string;
  submittedDate: string;
}

export const createQuote = (data: {
  items: Array<{ _id: string; name: string; quantity: number }>;
  buyerInfo: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    companyType: string;
    country: string;
  };
  notes: string;
  preferredContact: string;
}): Promise<{ quoteId: string; referenceNumber: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referenceNumber = `QUOTE-${Date.now()}`;
      resolve({
        quoteId: '1',
        referenceNumber,
      });
    }, 800);
  });
};

export const getQuotes = (): Promise<{ quotes: Quote[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockQuotes: Quote[] = [
        {
          _id: '1',
          referenceNumber: 'QUOTE-1234567890',
          date: '2024-01-12',
          items: [
            { name: 'Hydraulic Pump Assembly', quantity: 2 },
            { name: 'Engine Air Filter', quantity: 5 },
          ],
          status: 'Responded',
          buyerName: 'John Doe',
          buyerEmail: 'john@example.com',
          submittedDate: '2024-01-12',
        },
        {
          _id: '2',
          referenceNumber: 'QUOTE-1234567891',
          date: '2024-01-08',
          items: [
            { name: 'Transmission Fluid', quantity: 3 },
          ],
          status: 'Pending',
          buyerName: 'Jane Smith',
          buyerEmail: 'jane@example.com',
          submittedDate: '2024-01-08',
        },
      ];

      resolve({ quotes: mockQuotes });
    }, 500);
  });
};