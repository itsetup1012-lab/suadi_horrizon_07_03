"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getSafeImageUrl } from "@/lib/utils";
import {
    Package,
    Clock,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Truck,
    ShieldCheck
} from "lucide-react";

interface Product {
    id: string;
    name: string;
    sku: string;
    brand: string;
    category: string;
    price: number;
    image: { url?: string; public_id?: string } | string | null;
    in_stock: boolean;
    stock: number;
    updated_at: string;
    created_at: string;
    description?: string;
    oem_code?: string;
}

export default function RecentStockUpdates() {
    const { t } = useTranslation();
    const [products, setProducts] = useState < Product[] > ([]);
    const [categories, setCategories] = useState < string[] > ([]);
    const [activeCategory, setActiveCategory] = useState < string > ("all");
    const [loading, setLoading] = useState(true);
    const [scrollIndex, setScrollIndex] = useState(0);
    const scrollRef = useRef < HTMLDivElement > (null);
    const sectionRef = useRef < HTMLDivElement > (null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {
        fetchRecentProducts();
    }, []);

    const fetchRecentProducts = async () => {
        try {
            const res = await fetch("/api/products?limit=500");
            if (res.ok) {
                const data = await res.json();
                const allProds: Product[] = data.products || [];
                const sorted = [...allProds].sort(
                    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                );
                setProducts(sorted.slice(0, 50));
                const cats = [...new Set(sorted.map(p => p.category))].filter(Boolean);
                setCategories(cats as string[]);
            }
        } catch (error) {
            console.error("Failed to load recent products:", error);
        } finally {
            setLoading(false);
        }
    };

    const timeAgo = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor(diffMs / (1000 * 60));

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString();
    };

    const filteredProducts = activeCategory === "all"
        ? products
        : products.filter(p => p.category === activeCategory);
    const visibleProducts = filteredProducts.slice(scrollIndex, scrollIndex + 6);
    const maxScroll = Math.max(0, filteredProducts.length - 6);
    const scrollLeft = () => setScrollIndex(Math.max(0, scrollIndex - 6));
    const scrollRight = () => setScrollIndex(Math.min(maxScroll, scrollIndex + 6));

    if (loading) {
        return (
            <section className="relative py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-64 bg-white/5 rounded-xl" />
                        <div className="h-4 w-96 bg-white/5 rounded-xl" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-64 bg-white/5 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section ref={sectionRef} className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/5 border border-gold/10 rounded-full mb-4">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Recently Updated</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Recent Stock{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-400">
                            Updates
                        </span>
                    </h2>
                    <p className="text-slate-400 mt-3 text-sm max-w-2xl mx-auto">
                        New parts added and inventory refreshed. Browse our latest stock arrivals sorted by most recent updates.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-2 mb-10"
                >
                    <button
                        onClick={() => { setActiveCategory("all"); setScrollIndex(0); }}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === "all"
                            ? "bg-gold text-navy shadow-lg shadow-gold/20"
                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/[0.05]"
                            }`}
                    >
                        All ({products.length})
                    </button>
                    {categories.slice(0, 8).map(cat => (
                        <button
                            key={cat}
                            onClick={() => { setActiveCategory(cat); setScrollIndex(0); }}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat
                                ? "bg-gold text-navy shadow-lg shadow-gold/20"
                                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/[0.05]"
                                }`}
                        >
                            {cat}
                            <span className="ml-1.5 text-[9px] opacity-60">
                                ({products.filter(p => p.category === cat).length})
                            </span>
                        </button>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    {scrollIndex > 0 && (
                        <button
                            onClick={scrollLeft}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-navy/90 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all shadow-xl group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                    {scrollIndex < maxScroll && (
                        <button
                            onClick={scrollRight}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-navy/90 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all shadow-xl group"
                        >
                            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    )}

                    <div ref={scrollRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {visibleProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: 0.05 * index }}
                            >
                                <Link href={`/products/${product.id}`}>
                                    <div className="group relative bg-[#0A1017] border border-white/[0.05] rounded-2xl p-4 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 h-full flex flex-col">
                                        <div className="absolute top-3 right-3 z-10">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/20">
                                                <Clock className="w-2.5 h-2.5 text-gold" />
                                                <span className="text-[8px] font-bold text-gold uppercase tracking-wider">{timeAgo(product.updated_at)}</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 left-3 z-10">
                                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                                                <span className="text-[8px] font-bold text-emerald-400 uppercase">In Stock</span>
                                            </div>
                                        </div>
                                        <div className="relative w-full aspect-square mb-3 rounded-xl bg-navy overflow-hidden">
                                            {product.image ? (
                                                <img
                                                    src={getSafeImageUrl(product.image)}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-10 h-10 text-white/10" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <span className="text-[9px] font-bold text-gold uppercase tracking-wider mb-1">{product.category}</span>
                                            <h3 className="text-xs font-bold text-white leading-relaxed line-clamp-2 group-hover:text-gold transition-colors">{product.name}</h3>
                                            <div className="mt-auto pt-3 flex items-center justify-between">
                                                <div>
                                                    <span className="text-[10px] text-slate-500 block">SKU</span>
                                                    <span className="text-[10px] font-mono font-bold text-slate-300">{product.sku}</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-all">
                                                    <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:text-navy transition-colors" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-10"
                >
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-navy hover:border-gold transition-all group"
                    >
                        <Truck className="w-4 h-4" />
                        Browse All Products
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}