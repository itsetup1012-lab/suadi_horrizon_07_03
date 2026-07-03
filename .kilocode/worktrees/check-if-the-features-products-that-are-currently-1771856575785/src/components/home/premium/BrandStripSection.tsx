"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const brands = [
    { name: "CATERPILLAR", short: "CAT" },
    { name: "KOMATSU", short: "KMT" },
    { name: "VOLVO", short: "VLV" },
    { name: "HITACHI", short: "HTC" },
    { name: "DOOSAN", short: "DSN" },
    { name: "HYUNDAI", short: "HYN" },
    { name: "BOBCAT", short: "BBC" },
    { name: "JCB", short: "JCB" },
    { name: "CASE", short: "CASE" },
    { name: "TEREX", short: "TRX" },
];

export function BrandStripSection() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    return (
        <section className="py-20 md:py-28 lg:py-32 relative overflow-hidden">
            <div className="container-premium">
                <div className="bg-white/5 rounded-[2rem] border border-white/5 py-12 relative overflow-hidden">
                    {/* Gloss Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                    <div className="relative z-10 px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            className="text-center mb-8"
                        >
                            <span className="micro-label text-white/30">SUPPORTING THE WORLD'S LEADING FLEETS</span>
                        </motion.div>

                        <div ref={containerRef} className="relative">
                            {/* Fade Edges */}
                            <div className="absolute left-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-r from-[#111827]/80 to-transparent pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-l from-[#111827]/80 to-transparent pointer-events-none" />

                            <div className="flex overflow-hidden">
                                <motion.div
                                    className="flex items-center gap-20 whitespace-nowrap"
                                    animate={{
                                        x: [0, -120 * brands.length],
                                    }}
                                    transition={{
                                        duration: 35,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                >
                                    {[...brands, ...brands, ...brands].map((brand, index) => (
                                        <div
                                            key={`${brand.name}-${index}`}
                                            className="group flex flex-col items-center justify-center cursor-default"
                                        >
                                            <span className="text-2xl md:text-3xl font-black text-white/10 group-hover:text-gold/50 transition-all duration-500 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                                                {brand.name}
                                            </span>
                                            <div className="h-0.5 w-0 group-hover:w-full bg-gold/40 transition-all duration-700 mt-1.5" />
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
