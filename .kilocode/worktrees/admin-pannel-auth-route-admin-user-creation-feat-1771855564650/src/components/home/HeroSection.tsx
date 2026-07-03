"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { motion, useInView, type Variants } from "framer-motion";

// Animation variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function HeroSection() {
    return (
        <header className="relative min-h-[100vh] flex items-center pt-24 pb-12 overflow-hidden bg-navy">
            {/* Animated background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80 z-10" />
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-gold/10 via-transparent to-transparent" />
                <div className="absolute inset-0 z-10 bg-gradient-to-bl from-blue-900/10 via-transparent to-transparent" />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 z-10 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />

                <img
                    src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2070&auto=format&fit=crop"
                    alt="Industrial Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Floating decorative elements */}
            <motion.div
                className="absolute top-1/4 right-10 z-20 hidden lg:block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
            >
                <motion.div
                    className="w-20 h-20 rounded-full border border-gold/20 bg-navy/50 backdrop-blur-sm"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <Zap className="w-8 h-8 text-gold/60" />
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute bottom-1/3 left-10 z-20 hidden lg:block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <motion.div
                    className="w-16 h-16 rounded-full border border-white/10 bg-navy/50 backdrop-blur-sm"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white/40" />
                    </div>
                </motion.div>
            </motion.div>

            <div className="container mx-auto px-6 relative z-20">
                <div className="max-w-4xl">
                    {/* Badge with glow effect */}
                    <AnimatedSection>
                        <motion.div
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-gold/30 mb-10 backdrop-blur-xl"
                            variants={scaleIn}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                            </span>
                            <span className="text-gold text-xs font-bold tracking-widest uppercase font-display">Premium Industrial Solutions</span>
                        </motion.div>
                    </AnimatedSection>

                    {/* Headline with gradient text */}
                    <AnimatedSection>
                        <motion.h1
                            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.05]"
                            variants={fadeInUp}
                        >
                            Engineering the{" "}
                            <span className="relative">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold bg-[length:200%_auto] animate-shimmer">
                                    Future
                                </span>
                                <motion.span
                                    className="absolute -bottom-2 left-0 w-full h-1 bg-gold/30"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 1.2, duration: 0.8 }}
                                />
                            </span>{" "}
                            of{" "}
                            <br className="hidden md:block" />
                            Global Industry
                        </motion.h1>
                    </AnimatedSection>

                    {/* Subheadline */}
                    <AnimatedSection>
                        <motion.p
                            className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl leading-relaxed font-light"
                            variants={fadeInUp}
                        >
                            Optimize your operations with world-class machinery, OEM-certified parts, and 24/7 technical support.
                        </motion.p>
                    </AnimatedSection>

                    {/* CTAs with hover effects */}
                    <AnimatedSection>
                        <motion.div
                            className="flex flex-wrap gap-5"
                            variants={fadeInUp}
                        >
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href="/products"
                                    className="group relative bg-gold text-navy px-10 py-5 rounded-sm font-display text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 flex items-center gap-3 min-h-[56px] overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Explore Catalog
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.6 }}
                                    />
                                </Link>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href="/contact"
                                    className="group px-10 py-5 border border-white/20 hover:bg-white/5 hover:border-white/40 transition-all text-sm font-bold uppercase tracking-[0.2em] text-white rounded-sm font-display cursor-pointer min-h-[56px] flex items-center gap-3 backdrop-blur-sm relative overflow-hidden"
                                >
                                    <Truck className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors" />
                                    <span>Technical Support</span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </AnimatedSection>

                    {/* Trust badges */}
                    <AnimatedSection>
                        <motion.div
                            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10"
                            variants={fadeInUp}
                        >
                            {[
                                { number: "500+", label: "OEM Parts In Stock" },
                                { number: "24/7", label: "Mission Critical Support" },
                                { number: "15+", label: "Years Experience" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-3"
                                    whileHover={{ x: 5 }}
                                >
                                    <span className="text-2xl font-bold text-gold font-display">{item.number}</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatedSection>
                </div>
            </div>

            {/* Enhanced scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-slate-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
            >
                <motion.span
                    className="text-[10px] uppercase tracking-[0.3em] font-display font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Scroll
                </motion.span>
                <motion.div
                    className="w-px h-14 bg-gradient-to-b from-gold via-gold/50 to-transparent"
                    animate={{ scaleY: [0, 1, 0], y: [0, 0, 10] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>
        </header>
    );
}
