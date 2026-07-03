import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://saudihorizon.com';

// Static routes
const staticRoutes = [
    {
        url: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0,
    },
    {
        url: `${baseUrl}/products`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
    },
    {
        url: `${baseUrl}/about`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
    },
    {
        url: `${baseUrl}/contact`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
    },
    {
        url: `${baseUrl}/news`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
    },
    {
        url: `${baseUrl}/cart`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.5,
    },
    {
        url: `${baseUrl}/login`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.4,
    },
    {
        url: `${baseUrl}/register`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.4,
    },
    {
        url: `${baseUrl}/stores`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6,
    },
    {
        url: `${baseUrl}/shipping`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.5,
    },
    {
        url: `${baseUrl}/returns`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.5,
    },
    {
        url: `${baseUrl}/help`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.5,
    },
    {
        url: `${baseUrl}/promotions`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
    },
    {
        url: `${baseUrl}/wishlist`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.5,
    },
];

// News articles data (same as in news/page.tsx)
const newsArticles = [
    {
        id: '1',
        title: 'Saudi Horizon Expands Inventory with New CAT Equipment Parts',
        date: '2024-01-20',
    },
    {
        id: '2',
        title: 'Top 5 Maintenance Tips for Heavy Machinery',
        date: '2024-01-15',
    },
    {
        id: '3',
        title: 'Understanding Hydraulic System Components',
        date: '2024-01-10',
    },
    {
        id: '4',
        title: 'New Service Center Opening in Ahmadi',
        date: '2024-01-05',
    },
    {
        id: '5',
        title: 'Winter Machinery Maintenance Checklist',
        date: '2024-01-01',
    },
];

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Fetch products from API
async function getProducts(): Promise<Array<{ _id: string; name: string; updatedAt?: string }>> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/products?limit=1000`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Failed to fetch products for sitemap:', response.status);
            return [];
        }

        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Error fetching products for sitemap:', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [products] = await Promise.all([
        getProducts(),
    ]);

    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product._id}`,
        lastmod: product.updatedAt || new Date().toISOString(),
        changefreq: 'weekly' as const,
        priority: 0.8,
    }));

    const newsRoutes = newsArticles.map((article) => ({
        url: `${baseUrl}/news/${article.id}`,
        lastmod: new Date(article.date).toISOString(),
        changefreq: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes, ...newsRoutes];
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour
