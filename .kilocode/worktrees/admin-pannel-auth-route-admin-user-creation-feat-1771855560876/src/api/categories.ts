// Description: Get all product categories
// Endpoint: GET /api/categories
// Request: {}
// Response: { categories: Array<Category> }

export interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
  subcategories: string[];
}

export const getCategories = (): Promise<{ categories: Category[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockCategories: Category[] = [
        {
          _id: '1',
          name: 'Engine Parts',
          description: 'Complete engine components and assemblies',
          icon: 'Zap',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          productCount: 245,
          subcategories: ['Air Filters', 'Oil Filters', 'Spark Plugs', 'Gaskets'],
        },
        {
          _id: '2',
          name: 'Hydraulic Systems',
          description: 'Hydraulic pumps, cylinders, and valves',
          icon: 'Droplet',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          productCount: 189,
          subcategories: ['Pumps', 'Cylinders', 'Valves', 'Hoses'],
        },
        {
          _id: '3',
          name: 'Electrical Components',
          description: 'Alternators, starters, and electrical systems',
          icon: 'Zap',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          productCount: 156,
          subcategories: ['Alternators', 'Starters', 'Batteries', 'Wiring'],
        },
        {
          _id: '4',
          name: 'Undercarriage',
          description: 'Track links, sprockets, and undercarriage parts',
          icon: 'Layers',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          productCount: 203,
          subcategories: ['Track Links', 'Sprockets', 'Idlers', 'Rollers'],
        },
        {
          _id: '5',
          name: 'Transmission',
          description: 'Transmission components and fluids',
          icon: 'Cog',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          productCount: 134,
          subcategories: ['Gears', 'Bearings', 'Seals', 'Fluids'],
        },
        {
          _id: '6',
          name: 'Attachments',
          description: 'Buckets, blades, and other attachments',
          icon: 'Wrench',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
          productCount: 98,
          subcategories: ['Buckets', 'Blades', 'Forks', 'Hooks'],
        },
      ];

      resolve({ categories: mockCategories });
    }, 400);
  });
};