'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Tag, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const newsArticles = [
    {
        id: '1',
        title: 'Saudi Horizon Expands Inventory with New CAT Equipment Parts',
        excerpt: 'We are proud to announce the expansion of our inventory to include over 500 new CAT equipment parts, serving the growing demand in the construction industry.',
        category: 'Company News',
        date: '2024-01-20',
        readTime: '3 min read',
        image: '/api/placeholder/400/200',
        featured: true,
    },
    {
        id: '2',
        title: 'Top 5 Maintenance Tips for Heavy Machinery',
        excerpt: 'Regular maintenance is crucial for the longevity and performance of your heavy machinery. Learn the essential tips from our experts.',
        category: 'Tips & Guides',
        date: '2024-01-15',
        readTime: '5 min read',
        image: '/api/placeholder/400/200',
        featured: false,
    },
    {
        id: '3',
        title: 'Understanding Hydraulic System Components',
        excerpt: 'A comprehensive guide to understanding how hydraulic systems work and common issues to watch out for.',
        category: 'Technical',
        date: '2024-01-10',
        readTime: '7 min read',
        image: '/api/placeholder/400/200',
        featured: false,
    },
    {
        id: '4',
        title: 'New Service Center Opening in Ahmadi',
        excerpt: 'We are excited to announce the opening of our new service center in Ahmadi, providing convenient access to our maintenance services.',
        category: 'Company News',
        date: '2024-01-05',
        readTime: '2 min read',
        image: '/api/placeholder/400/200',
        featured: false,
    },
    {
        id: '5',
        title: 'Winter Machinery Maintenance Checklist',
        excerpt: 'Prepare your equipment for the winter season with our comprehensive maintenance checklist.',
        category: 'Tips & Guides',
        date: '2024-01-01',
        readTime: '4 min read',
        image: '/api/placeholder/400/200',
        featured: false,
    },
];

const categories = ['All', 'Company News', 'Tips & Guides', 'Technical', 'Industry'];

export default function NewsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const [filteredArticles, setFilteredArticles] = React.useState(newsArticles);

    React.useEffect(() => {
        let filtered = newsArticles;

        if (searchQuery) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(article => article.category === selectedCategory);
        }

        setFilteredArticles(filtered);
    }, [searchQuery, selectedCategory]);

    const featuredArticle = filteredArticles.find(a => a.featured) || filteredArticles[0];
    const regularArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-6xl mx-auto px-4">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>News & Updates</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">News & Updates</h1>
                    <p className="text-muted-foreground">Stay informed about the latest news, tips, and industry insights</p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search articles..."
                            className="pl-12"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(category => (
                            <Badge
                                key={category}
                                variant={selectedCategory === category ? 'default' : 'outline'}
                                className="cursor-pointer px-4 py-2"
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Featured Article */}
                {featuredArticle && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <Card className="glass-strong overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <div className="h-64 md:h-auto bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                    <Tag className="w-16 h-16 text-primary/30" />
                                </div>
                                <CardContent className="p-8 flex flex-col justify-center">
                                    <Badge className="w-fit mb-4">{featuredArticle.category}</Badge>
                                    <h2 className="text-2xl font-bold mb-3">{featuredArticle.title}</h2>
                                    <p className="text-muted-foreground mb-4">{featuredArticle.excerpt}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {featuredArticle.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {featuredArticle.readTime}
                                        </span>
                                    </div>
                                    <Button onClick={() => router.push(`/news/${featuredArticle.id}`)}>
                                        Read More
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </CardContent>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Articles Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="glass-light dark:glass-dark h-full hover:border-primary/50 transition-all cursor-pointer">
                                <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                    <Tag className="w-12 h-12 text-primary/30" />
                                </div>
                                <CardContent className="p-5">
                                    <Badge variant="outline" className="mb-3">{article.category}</Badge>
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {article.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {article.readTime}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredArticles.length === 0 && (
                    <div className="text-center py-12">
                        <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No articles found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
