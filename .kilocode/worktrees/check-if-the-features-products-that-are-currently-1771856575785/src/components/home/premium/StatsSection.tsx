"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
    { value: 15, suffix: "+", label: "YEARS OF EXCELLENCE", detail: "Serving the Middle East since 2009" },
    { value: 1000, suffix: "+", label: "SATISFIED CLIENTS", detail: "Across construction & mining sectors" },
    { value: 720, suffix: "+", label: "PARTS AVAILABLE", detail: "Genuine OEM & aftermarket inventory" },
    { value: 98, suffix: "%", label: "ON-TIME DELIVERY", detail: "Minimizing operational downtime" },
];

function Counter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;

        let start = 0;
        const duration = 2000;
        const increment = value / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [inView, value]);

    return (
        <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient-gold block mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {count}{suffix}
        </span>
    );
}

export function StatsSection() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    return (
        <section
            ref={containerRef}
            className="py-20 md:py-28 lg:py-32 relative overflow-hidden"
        >
            <div className="container-premium">
                <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-12 md:p-20 lg:p-24 relative overflow-hidden mx-auto w-full">
                    {/* Background Texture */}
                    <div className="absolute inset-0 gradient-accent-glow opacity-20" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '80px 80px'
                        }}
                    />

                    <div className="relative z-10">
                        {/* Section Header - Centered with more breathing room */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-24 max-w-3xl mx-auto"
                        >
                            <span className="micro-label mb-6 block tracking-[0.3em]">OUR IMPACT</span>
                            <h2 className="heading-md mb-6">Numbers That Speak</h2>
                            <div className="w-16 h-1 bg-gold/40 mx-auto rounded-full" />
                        </motion.div>

                        {/* Stats Grid - 4 Columns with clear separation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                    className="text-center group"
                                >
                                    <Counter
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        inView={isInView}
                                    />
                                    <div className="space-y-3">
                                        <div className="text-xs font-black text-white/40 tracking-[0.25em] group-hover:text-gold/60 transition-colors">
                                            {stat.label}
                                        </div>
                                        <p className="text-sm text-white/30 max-w-[180px] mx-auto leading-relaxed font-medium">
                                            {stat.detail}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom Trust Note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="mt-24 pt-12 border-t border-white/5 text-center"
                        >
                            <p className="text-sm text-white/20 font-bold tracking-widest uppercase">
                                Trusted by construction leaders, mining operations, and industrial facilities worldwide.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
