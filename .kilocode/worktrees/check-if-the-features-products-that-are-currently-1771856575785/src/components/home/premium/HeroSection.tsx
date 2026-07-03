"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, MessageCircle, ShieldCheck, Globe, Clock } from "lucide-react";

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "0px" });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    const trustSignals = [
        { icon: ShieldCheck, text: "Genuine OEM Parts" },
        { icon: Globe, text: "Worldwide Logistics" },
        { icon: Clock, text: "24/7 Technical Support" },
    ];

    return (
        <section
            ref={containerRef}
            className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-12 pb-24"
        >
            {/* Background Image with Ken Burns Effect */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ scale }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/home/hero_bulldozer.png')",
                    }}
                />
                <div className="absolute inset-0 gradient-hero-overlay" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 gradient-accent-glow" />
            </motion.div>

            {/* Content */}
            <div className="container-premium relative z-10">
                <div className="max-w-4xl">
                    {/* Micro Label */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex items-center gap-3 mb-8"
                    >
                        <div className="w-12 h-px bg-gold/50" />
                        <span className="micro-label">SINCE 2009 — PREMIUM EQUIPMENT PARTS</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-10"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Engineered for<br />
                        <span className="text-gradient-gold">performance.</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl leading-relaxed"
                    >
                        Genuine OEM and aftermarket spare parts for the world's toughest machines.
                        Your equipment's reliability starts here.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-wrap gap-6 items-center mb-16"
                    >
                        <Link href="/products" className="btn-primary px-10 py-5 text-base">
                            Explore Catalog
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link href="/contact" className="btn-secondary px-10 py-5 text-base">
                            Get Quote
                        </Link>
                    </motion.div>

                    {/* Minimal Trust Indicator - Replaces the heavy Stats box */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-wrap gap-x-12 gap-y-6 pt-12 border-t border-white/10"
                    >
                        {trustSignals.map((signal, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <signal.icon className="w-5 h-5 text-gold/60" />
                                <span className="text-xs font-bold uppercase tracking-widest text-white/40">{signal.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex flex-col items-center gap-3 text-white/30"
                >
                    <ChevronDown className="w-6 h-6" />
                </motion.div>
            </motion.div>
        </section>
    );
}
