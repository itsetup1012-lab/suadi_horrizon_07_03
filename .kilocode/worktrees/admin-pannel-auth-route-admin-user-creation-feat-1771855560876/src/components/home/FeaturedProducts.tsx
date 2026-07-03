"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts, Product } from "@/api/products";
import { ProductCard } from "@/components/ProductCard";
import { motion, useInView, type Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

export function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProducts({ limit: 4 });
                setProducts(data.products);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddToCart = (product: Product) => {
        console.log("Add to cart:", product.name);
    };

    const handleQuickInquiry = (product: Product) => {
        console.log("Quick inquiry:", product.name);
    };

    return (
        <section className="py-32 bg-navy relative border-t border-white/5 overflow-hidden">
            {/* Background elements */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-t from-gold/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl" />

            {/* Animated grid lines */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <motion.span
                            className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block font-display"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Genuine Parts
                        </motion.span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-display">Recent Arrivals</h2>
                    </div>
                    <motion.div
                        whileHover={{ x: 5 }}
                    >
                        <Link href="/products" className="group flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest hover:text-gold transition-colors">
                            View Complete Catalog
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="aspect-[3/4] bg-white/5 animate-pulse rounded-sm"
                            />
                        ))}
                    </div>
                ) : (
                    <div ref={containerRef} className="relative">
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                        >
                            {products.slice(0, 4).map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    variants={itemVariants}
                                >
                                    <ProductCard
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                        onQuickInquiry={handleQuickInquiry}
                                        index={index}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}

                {/* Bottom CTA */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-white/[0.08] rounded-sm text-white font-bold uppercase tracking-widest text-sm transition-all duration-300"
                    >
                        Browse Full Catalog
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
