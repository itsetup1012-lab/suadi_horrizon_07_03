import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://saudihorizon.com';

// News articles data (same as in page.tsx)
const newsArticles: Record<string, {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    author: string;
}> = {
    '1': {
        id: '1',
        title: 'Saudi Horizon Expands Inventory with New CAT Equipment Parts',
        excerpt: 'We are proud to announce the expansion of our inventory to include over 500 new CAT equipment parts, serving the growing demand in the construction industry.',
        content: `Saudi Horizon is excited to announce a major expansion of our inventory...`,
        category: 'Company News',
        date: '2024-01-20',
        readTime: '3 min read',
        image: '/api/placeholder/800/400',
        author: 'Saudi Horizon Team',
    },
    '2': {
        id: '2',
        title: 'Top 5 Maintenance Tips for Heavy Machinery',
        excerpt: 'Regular maintenance is crucial for the longevity and performance of your heavy machinery.',
        content: `Proper maintenance is the key to maximizing the lifespan...`,
        category: 'Tips & Guides',
        date: '2024-01-15',
        readTime: '5 min read',
        image: '/api/placeholder/800/400',
        author: 'Technical Team',
    },
    '3': {
        id: '3',
        title: 'Understanding Hydraulic System Components',
        excerpt: 'A comprehensive guide to understanding how hydraulic systems work.',
        content: `Hydraulic systems power much of today's heavy equipment...`,
        category: 'Technical',
        date: '2024-01-10',
        readTime: '7 min read',
        image: '/api/placeholder/800/400',
        author: 'Senior Technician',
    },
    '4': {
        id: '4',
        title: 'New Service Center Opening in Ahmadi',
        excerpt: 'We are excited to announce the opening of our new service center in Ahmadi.',
        content: `Saudi Horizon is pleased to announce the opening of our newest service center...`,
        category: 'Company News',
        date: '2024-01-05',
        readTime: '2 min read',
        image: '/api/placeholder/800/400',
        author: 'Marketing Team',
    },
    '5': {
        id: '5',
        title: 'Winter Machinery Maintenance Checklist',
        excerpt: 'Prepare your equipment for the winter season with our comprehensive checklist.',
        content: `Winter presents unique challenges for heavy machinery...`,
        category: 'Tips & Guides',
        date: '2024-01-01',
        readTime: '4 min read',
        image: '/api/placeholder/800/400',
        author: 'Service Department',
    },
};

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    const article = newsArticles[id];

    if (!article) {
        return {
            title: 'Article Not Found | Saudi Horizon',
            description: 'The requested article could not be found.',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = `${article.title} | Saudi Horizon News`;
    const description = article.excerpt;

    return {
        title,
        description,
        keywords: [
            article.category.toLowerCase(),
            'saudi horizon',
            'heavy equipment',
            'spare parts',
            'construction',
            'machinery',
        ].join(', '),
        authors: [{ name: article.author }],
        creator: article.author,
        publisher: 'Saudi Horizon',
        openGraph: {
            type: 'article',
            title,
            description,
            url: `${baseUrl}/news/${id}`,
            images: [
                {
                    url: article.image,
                    width: 800,
                    height: 400,
                    alt: article.title,
                },
            ],
            siteName: 'Saudi Horizon',
            locale: 'en_US',
            publishedTime: article.date,
            modifiedTime: article.date,
            authors: [article.author],
            section: article.category,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [article.image],
            creator: '@saudihorizon',
        },
        alternates: {
            canonical: `${baseUrl}/news/${id}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

