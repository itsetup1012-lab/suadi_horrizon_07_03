'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Layout, Package, ShoppingCart, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const slides = [
    {
        id: 'intro',
        title: 'Project Status & Feature Presentation',
        subtitle: 'Saudi Horizon Digital Platform',
        content: (
            <div className="text-center space-y-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/30"
                >
                    <ShieldCheck className="w-12 h-12 text-gold" />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-bold font-display text-white tracking-tight">
                    Engineering <span className="text-gold">Excellence</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                    A comprehensive update on the digital transformation and feature-set of the Saudi Horizon B2B industrial platform.
                </p>
                <div className="pt-8">
                    <span className="text-xs uppercase tracking-[0.4em] text-gold/60 font-bold">Press space or use arrows to navigate</span>
                </div>
            </div>
        )
    },
    {
        id: 'overview',
        title: 'Project Overview',
        content: (
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <span className="text-gold text-sm font-bold uppercase tracking-widest font-display">01. Purpose</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-display">Saudi Horizon</h2>
                        <p className="text-lg text-slate-300 leading-relaxed font-light">
                            A premium industrial B2B platform designed for the heavy equipment and parts distribution sector in the Middle East.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { title: 'Reliability', desc: 'Sourcing OEM-certified parts for critical machinery.' },
                            { title: 'Technical Precision', desc: 'Advanced search and specification verification.' },
                            { title: 'Seamless UX', desc: 'BMT-optimized procurement and account management.' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5"
                            >
                                <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-white font-bold">{item.title}</h4>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="relative aspect-square">
                    <div className="absolute inset-0 bg-gold/10 rounded-3xl blur-3xl animate-pulse" />
                    <div className="relative h-full w-full rounded-2xl border border-white/10 bg-surface/50 overflow-hidden group">
                        <img
                            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80"
                            alt="Industrial"
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'landing',
        title: 'Industrial Landing Page',
        content: (
            <div className="space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <span className="text-gold text-sm font-bold uppercase tracking-widest font-display">02. Front-end Excellence</span>
                    <h2 className="text-4xl font-bold text-white font-display">The Landing Experience</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Layout, title: 'Hero Dynamic', desc: 'High-impact brand storytelling with smooth animations.' },
                        { icon: ShoppingCart, title: 'Brand Marquee', desc: 'Real-time display of trusted OEM partners.' },
                        { icon: ShieldCheck, title: 'Process View', desc: 'Interactive precision parts supply chain flows.' },
                        { icon: Package, title: 'Why Choose Us', desc: 'Value-propositions for 15+ years of expertise.' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/30 hover:bg-white/[0.05] transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-gold" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 font-display">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        )
    },
    {
        id: 'ecommerce',
        title: 'E-commerce & Logistics',
        content: (
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-navy/80 to-navy" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-24 h-32 bg-white/5 rounded-lg border border-white/10 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <span className="text-gold text-sm font-bold uppercase tracking-widest font-display">03. Operational Flow</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-display">Integrated Marketplace</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { title: 'Featured Machinery', desc: 'Showcase of heavy equipment with high-fidelity visuals.' },
                            { title: 'Product Catalog', desc: 'Dynamic filtering and search for thousands of parts.' },
                            { title: 'Parts Lookup', desc: 'Specialized search by OEM number or machinery model.' },
                            { title: 'Bulk Inquiry', desc: 'Optimized inquiry flow for large-scale procurement.' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 hover:border-gold/20 transition-all cursor-default">
                                <div className="text-gold font-bold font-display text-lg">0{i + 1}.</div>
                                <div>
                                    <h4 className="text-white font-bold">{item.title}</h4>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
];

export default function PresentationPage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="fixed inset-0 bg-navy z-[100] overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

            {/* Navigation Header */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
                <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors font-display tracking-widest text-sm font-bold group">
                    <Home className="w-4 h-4" />
                    BACK TO SITE
                </Link>
                <div className="flex gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-gold' : 'w-2 bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Slide Content */}
            <main className="relative h-full w-full max-w-7xl mx-auto flex items-center px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full"
                    >
                        {slides[currentSlide].content}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end z-50">
                <div className="hidden md:block">
                    <span className="text-white/20 font-display text-9xl font-bold select-none">
                        0{currentSlide + 1}
                    </span>
                </div>
                <div className="flex gap-4 p-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
                    <button
                        onClick={prevSlide}
                        className="p-4 rounded-full hover:bg-white/5 transition-colors text-white/60 hover:text-gold"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="p-4 rounded-full bg-gold hover:bg-yellow-500 transition-colors text-navy shadow-lg shadow-gold/20"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
