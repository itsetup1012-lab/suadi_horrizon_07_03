'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

// News articles data (same as in news/page.tsx)
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
    featured: boolean;
}> = {
    '1': {
        id: '1',
        title: 'Saudi Horizon Expands Inventory with New CAT Equipment Parts',
        excerpt: 'We are proud to announce the expansion of our inventory to include over 500 new CAT equipment parts, serving the growing demand in the construction industry.',
        content: `Saudi Horizon is excited to announce a major expansion of our inventory, now featuring over 500 new CAT (Caterpillar) equipment parts. This significant investment reflects our commitment to serving the growing construction industry in Saudi Arabia and the wider region.

Key highlights of this expansion include:
- Hydraulic components for excavators and loaders
- Engine parts and filters
- Undercarriage components
- Electrical systems and sensors
- Cabin interior parts and accessories

Our expanded inventory ensures that construction companies, mining operations, and heavy equipment rental businesses can find the parts they need quickly, minimizing downtime and keeping projects on schedule.

"We understand that every hour of equipment downtime costs money," said our operations director. "By expanding our CAT parts inventory, we're helping our customers reduce wait times and maintain optimal productivity."

All parts in this expansion come with our standard warranty and are backed by our expert technical support team. Contact us today to learn more about our expanded CAT parts selection.`,
        category: 'Company News',
        date: '2024-01-20',
        readTime: '3 min read',
        image: '/api/placeholder/800/400',
        author: 'Saudi Horizon Team',
        featured: true,
    },
    '2': {
        id: '2',
        title: 'Top 5 Maintenance Tips for Heavy Machinery',
        excerpt: 'Regular maintenance is crucial for the longevity and performance of your heavy machinery. Learn the essential tips from our experts.',
        content: `Proper maintenance is the key to maximizing the lifespan and performance of heavy machinery. Here are our top five tips to keep your equipment running smoothly.

1. **Follow Manufacturer Service Intervals**
Always adhere to the recommended service schedules provided in your equipment manual. These intervals are designed based on extensive testing and field data.

2. **Check Fluid Levels Daily**
Before starting any machine, check oil, coolant, and hydraulic fluid levels. Low fluids can lead to catastrophic failures.

3. **Inspect Filters Regularly**
Air, oil, and fuel filters should be inspected and replaced according to schedule. Clogged filters reduce efficiency and can cause engine damage.

4. **Monitor Tire/Track Wear**
Check tire pressure and track tension regularly. Uneven wear patterns can indicate alignment issues or improper usage.

5. **Keep Records**
Maintain detailed maintenance logs. This helps identify recurring issues and provides valuable data for resale purposes.

Regular maintenance not only extends equipment life but also improves safety on the job site.`,
        category: 'Tips & Guides',
        date: '2024-01-15',
        readTime: '5 min read',
        image: '/api/placeholder/800/400',
        author: 'Technical Team',
        featured: false,
    },
    '3': {
        id: '3',
        title: 'Understanding Hydraulic System Components',
        excerpt: 'A comprehensive guide to understanding how hydraulic systems work and common issues to watch out for.',
        content: `Hydraulic systems power much of today's heavy equipment. Understanding their components can help with troubleshooting and maintenance.

**Main Components:**

1. **Hydraulic Pump**
The heart of the system, converting mechanical energy into hydraulic energy. Common types include gear, piston, and vane pumps.

2. **Hydraulic Motor**
Converts hydraulic energy back into mechanical energy to drive wheels, tracks, or other components.

3. **Hydraulic Cylinder**
Produces linear motion and force for bucket, boom, and other moving parts.

4. **Valves**
Control the direction, pressure, and flow of hydraulic fluid. Includes directional control valves, pressure relief valves, and flow control valves.

5. **Hydraulic Fluid**
The medium that transmits power. Must be clean and at the proper level for optimal performance.

**Common Issues:**
- Overheating (often due to low fluid or worn components)
- Unusual noises (may indicate cavitation or air in the system)
- Slow operation (could be clogged filters or worn pumps)

Regular fluid analysis can help identify problems before they cause equipment failure.`,
        category: 'Technical',
        date: '2024-01-10',
        readTime: '7 min read',
        image: '/api/placeholder/800/400',
        author: 'Senior Technician',
        featured: false,
    },
    '4': {
        id: '4',
        title: 'New Service Center Opening in Ahmadi',
        excerpt: 'We are excited to announce the opening of our new service center in Ahmadi, providing convenient access to our maintenance services.',
        content: `Saudi Horizon is pleased to announce the opening of our newest service center in Ahmadi. This strategic expansion allows us to better serve customers in the region with convenient access to professional maintenance and repair services.

**Facility Features:**
- 10,000 square feet of service bay space
- 5 dedicated work bays for heavy equipment
- Skilled technicians certified in major brands
- Genuine parts inventory on-site
- Comfortable customer waiting area

**Services Offered:**
- Routine maintenance
- Major repairs and overhauls
- Hydraulic system service
- Electrical system diagnostics
- Welding and fabrication

The Ahmadi location is strategically positioned to serve industrial areas and construction sites throughout the region. Our goal is to reduce equipment downtime by providing quick, professional service.

Grand opening special: 20% off first service visit for new customers. Contact us to schedule your appointment.`,
        category: 'Company News',
        date: '2024-01-05',
        readTime: '2 min read',
        image: '/api/placeholder/800/400',
        author: 'Marketing Team',
        featured: false,
    },
    '5': {
        id: '5',
        title: 'Winter Machinery Maintenance Checklist',
        excerpt: 'Prepare your equipment for the winter season with our comprehensive maintenance checklist.',
        content: `Winter presents unique challenges for heavy machinery. Use this checklist to prepare your equipment for cold weather operation.

**Before Winter Storage:**
- Change engine oil to prevent sludge buildup
- Add fuel stabilizer to prevent fuel degradation
- Fully charge batteries and disconnect if storing for extended periods
- Grease all pivot points and bearings
- Inspect and repair any leaks

**Cold Weather Operation:**
- Use engine block heaters in extreme cold
- Install proper viscosity hydraulic fluid for low temperatures
- Check coolant freeze protection levels
- Verify tire pressure (drops with temperature)
- Keep fuel tanks full to prevent condensation

**Daily Checks:**
- Check battery health and connections
- Inspect hydraulic lines for cracks or leaks
- Verify heating and defrost systems work
- Warm up equipment properly before heavy use

**Emergency Kit Recommendations:**
- Engine block heater extension cords
- Thermal blankets
- Jump starter pack
- Basic tool kit
- Flashlight and batteries

Proper winter preparation prevents costly breakdowns and extends equipment life.`,
        category: 'Tips & Guides',
        date: '2024-01-01',
        readTime: '4 min read',
        image: '/api/placeholder/800/400',
        author: 'Service Department',
        featured: false,
    },
};

export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const articleId = params.id as string;

    const article = newsArticles[articleId];

    if (!article) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl text-white mb-4">Article not found</h1>
                    <Button onClick={() => router.push('/news')}>
                        Back to News
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/news')}>News</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>{article.title}</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-6 text-gray-300 hover:text-white"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Article Header */}
                    <header className="mb-8">
                        <Badge className="mb-4">{article.category}</Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {article.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                {article.author}
                            </span>
                        </div>

                        {/* Featured Image */}
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden mb-6">
                            <div className="w-full h-full flex items-center justify-center">
                                <Tag className="w-24 h-24 text-primary/30" />
                            </div>
                        </div>
                    </header>

                    {/* Article Content */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-8">
                            <div className="prose prose-invert max-w-none">
                                {article.content.split('\n\n').map((paragraph, index) => {
                                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                        return (
                                            <h2 key={index} className="text-2xl font-bold mt-6 mb-4 text-white">
                                                {paragraph.replace(/\*\*/g, '')}
                                            </h2>
                                        );
                                    }
                                    if (paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('4.') || paragraph.startsWith('5.')) {
                                        return (
                                            <p key={index} className="text-gray-300 mt-4 mb-2 pl-4 border-l-2 border-primary/50">
                                                {paragraph.replace(/^\d+\.\s*/, '')}
                                            </p>
                                        );
                                    }
                                    if (paragraph.startsWith('-')) {
                                        return (
                                            <p key={index} className="text-gray-300 mt-2 mb-2 pl-4">
                                                {paragraph}
                                            </p>
                                        );
                                    }
                                    return (
                                        <p key={index} className="text-gray-300 mb-4">
                                            {paragraph}
                                        </p>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Articles */}
                    <section className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {Object.values(newsArticles)
                                .filter(a => a.id !== article.id)
                                .slice(0, 2)
                                .map((relatedArticle) => (
                                    <Card
                                        key={relatedArticle.id}
                                        className="bg-gray-800 border-gray-700 cursor-pointer hover:border-primary/50 transition-colors"
                                        onClick={() => router.push(`/news/${relatedArticle.id}`)}
                                    >
                                        <CardContent className="p-5">
                                            <Badge variant="outline" className="mb-3">{relatedArticle.category}</Badge>
                                            <h3 className="font-bold text-lg mb-2 line-clamp-2">{relatedArticle.title}</h3>
                                            <div className="flex items-center justify-between text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {relatedArticle.date}
                                                </span>
                                                <span className="flex items-center gap-1 text-primary">
                                                    Read more
                                                    <ChevronRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </section>
                </motion.article>
            </div>
        </div>
    );
}
