"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getMachinery, Machinery } from "@/api/machinery";
import { MachineryCard } from "@/components/MachineryCard";
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

export function FeaturedMachinery() {
    const [machinery, setMachinery] = useState<Machinery[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMachinery({ limit: 4 });
                setMachinery(data.machinery);
            } catch (error) {
                console.error("Failed to fetch machinery", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleQuickInquiry = (item: Machinery) => {
        console.log("Quick inquiry for:", item.name);
    };

    return (
        <section className="py-32 bg-surface relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Gradient accents */}
            <div className="absolute top-20 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-0 w-64 h-64 bg-blue-900/5 rounded-full blur-3xl" />

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
                            Heavy Equipment
                        </motion.span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-display">Featured Machinery</h2>
                    </div>
                    <motion.div whileHover={{ x: 5 }}>
                        <Link href="/products" className="group flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest hover:text-gold transition-colors">
                            View All Inventory
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
                    <motion.div
                        ref={containerRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        {machinery.slice(0, 4).map((item, index) => (
                            <motion.div
                                key={item._id}
                                variants={itemVariants}
                            >
                                <MachineryCard
                                    machinery={item}
                                    onQuickInquiry={handleQuickInquiry}
                                    index={index}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
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
                        Browse Full Inventory
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
