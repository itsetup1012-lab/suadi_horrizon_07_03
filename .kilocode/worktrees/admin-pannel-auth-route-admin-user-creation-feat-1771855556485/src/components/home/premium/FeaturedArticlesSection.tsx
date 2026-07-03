"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const articles = [
    {
        id: '1',
        title: 'Saudi Horizon Expands Inventory with New CAT Equipment Parts',
        excerpt: 'We are proud to announce the expansion of our inventory to include over 500 new CAT equipment parts...',
        category: 'Company News',
        date: 'Jan 20, 2024',
        readTime: '3 min read',
        image: '/images/home/engine.png'
    },
    {
        id: '2',
        title: 'Top 5 Maintenance Tips for Heavy Machinery',
        excerpt: 'Regular maintenance is crucial for the longevity and performance of your heavy machinery...',
        category: 'Tips & Guides',
        date: 'Jan 15, 2024',
        readTime: '5 min read',
        image: '/images/home/excellence.png'
    },
    {
        id: '3',
        title: 'Understanding Hydraulic System Components',
        excerpt: 'A comprehensive guide to understanding how hydraulic systems work and common issues to watch out for.',
        category: 'Technical',
        date: 'Jan 10, 2024',
        readTime: '7 min read',
        image: '/images/home/electrical.png'
    }
];

export function FeaturedArticlesSection() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    return (
        <section ref={containerRef} className="py-20 md:py-28 lg:py-32 relative overflow-hidden bg-navy">
            <div className="container-premium relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <span className="micro-label mb-4 block">NEWS & INSIGHTS</span>
                        <h2 className="heading-md">Industrial <span className="text-gradient-gold">Intelligence</span></h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <Link href="/news" className="group flex items-center gap-2 text-gold font-bold hover:text-white transition-colors uppercase tracking-widest text-xs">
                            View All Articles
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-gold/30 hover:bg-white/10 transition-all duration-500"
                        >
                            <div className="relative h-60 overflow-hidden">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-gold text-navy text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-xl">
                                        {article.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest mb-4">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-gold" />
                                        {article.date}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-gold" />
                                        {article.readTime}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-gold transition-colors leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-white/60 text-sm mb-6 line-clamp-2 flex-1">
                                    {article.excerpt}
                                </p>

                                <Link href={`/news/${article.id}`} className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group/link mt-auto">
                                    Read Article
                                    <div className="w-8 h-px bg-gold/50 group-hover/link:w-12 transition-all" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
