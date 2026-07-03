// Description: Get all machinery listings
// Endpoint: GET /api/machinery
// Request: { type?: string, brand?: string, priceMin?: number, priceMax?: number }
// Response: { machinery: Array<Machinery>, total: number }

export interface Machinery {
  _id: string;
  name: string;
  model: string;
  brand: string;
  type: string;
  year: number;
  price: number;
  condition: 'New' | 'Used' | 'Refurbished';
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  location: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  hours?: number;
}

export const getMachinery = (filters?: {
  type?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
}): Promise<{ machinery: Machinery[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMachinery: Machinery[] = [
        {
          _id: '1',
          name: 'CAT 320D Excavator',
          model: '320D',
          brand: 'CAT',
          type: 'Excavator',
          year: 2020,
          price: 45000,
          condition: 'Used',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          ],
          description: 'Well-maintained CAT 320D excavator with full service history',
          specs: {
            'Operating Weight': '31,800 kg',
            'Bucket Capacity': '0.94 m³',
            'Engine Power': '110 kW',
            'Working Hours': '4,200 hrs',
          },
          location: 'Dubai, UAE',
          inStock: true,
          rating: 4.6,
          reviews: 12,
        },
        {
          _id: '2',
          name: 'Komatsu PC200 Excavator',
          model: 'PC200',
          brand: 'Komatsu',
          type: 'Excavator',
          year: 2019,
          price: 42000,
          condition: 'Used',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          ],
          description: 'Reliable Komatsu PC200 with excellent fuel efficiency',
          specs: {
            'Operating Weight': '20,900 kg',
            'Bucket Capacity': '0.6 m³',
            'Engine Power': '92 kW',
            'Working Hours': '5,100 hrs',
          },
          location: 'Singapore',
          inStock: true,
          rating: 4.5,
          reviews: 8,
        },
        {
          _id: '3',
          name: 'Volvo EC300 Excavator',
          model: 'EC300',
          brand: 'Volvo',
          type: 'Excavator',
          year: 2021,
          price: 55000,
          condition: 'New',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          ],
          description: 'Brand new Volvo EC300 with latest technology',
          specs: {
            'Operating Weight': '30,500 kg',
            'Bucket Capacity': '1.0 m³',
            'Engine Power': '130 kW',
            'Working Hours': '0 hrs',
          },
          location: 'India',
          inStock: true,
          rating: 4.9,
          reviews: 5,
        },
        {
          _id: '4',
          name: 'JCB 3CX Backhoe Loader',
          model: '3CX',
          brand: 'JCB',
          type: 'Backhoe Loader',
          year: 2018,
          price: 28000,
          condition: 'Used',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          ],
          description: 'Versatile JCB 3CX backhoe loader for multiple applications',
          specs: {
            'Operating Weight': '9,200 kg',
            'Bucket Capacity': '0.25 m³',
            'Engine Power': '74 kW',
            'Working Hours': '6,800 hrs',
          },
          location: 'Pakistan',
          inStock: true,
          rating: 4.4,
          reviews: 10,
        },
      ];

      resolve({
        machinery: mockMachinery,
        total: mockMachinery.length,
      });
    }, 500);
  });
};

export const getMachineryById = (id: string): Promise<Machinery> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const machinery: Machinery = {
        _id: id,
        name: 'CAT 320D Excavator',
        model: '320D',
        brand: 'CAT',
        type: 'Excavator',
        year: 2020,
        price: 45000,
        condition: 'Used',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
        ],
        description: 'Well-maintained CAT 320D excavator with full service history. This machine is in excellent working condition and ready for immediate deployment.',
        specs: {
          'Operating Weight': '31,800 kg',
          'Bucket Capacity': '0.94 m³',
          'Engine Power': '110 kW',
          'Working Hours': '4,200 hrs',
          'Fuel Type': 'Diesel',
          'Transmission': 'Hydrostatic',
          'Max Digging Depth': '6.5 m',
        },
        location: 'Dubai, UAE',
        inStock: true,
        rating: 4.6,
        reviews: 12,
      };
      resolve(machinery);
    }, 300);
  });
};