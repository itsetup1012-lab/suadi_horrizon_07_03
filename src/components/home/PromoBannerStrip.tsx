'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
    _id: string;
    title: string;
    subtitle?: string;
    image?: string;
    link?: string;
    ctaText?: string;
    position: string;
}

export function PromoBannerStrip() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [current, setCurrent] = useState(0);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetch('/api/banners?position=hero')
            .then(r => r.json())
            .then(d => {
                if (d.banners?.length) setBanners(d.banners);
            })
            .catch(() => { }); // Silently fail — banners are non-critical
    }, []);

    const visible = banners.filter(b => !dismissed.has(b._id));

    if (visible.length === 0) return null;

    const banner = visible[current % visible.length];

    const dismiss = (id: string) => {
        setDismissed(prev => new Set([...prev, id]));
        setCurrent(0);
    };

    return (
        <AnimatePresence>
            <motion.div
                key={banner._id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="relative w-full overflow-hidden"
                style={{
                    background: banner.image
                        ? `linear-gradient(to right, rgba(10,16,23,0.92) 40%, rgba(10,16,23,0.5)), url(${banner.image}) center/cover no-repeat`
                        : 'linear-gradient(135deg, #0A1017 0%, #0f1e2e 100%)',
                }}
            >
                {/* Gold top border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
                    {/* Content */}
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                        {/* Gold pulse dot */}
                        <div className="flex-shrink-0 relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
                            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-yellow-500/30 scale-150 animate-ping" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-yellow-500/70 uppercase tracking-[0.25em] mb-0.5">
                                Limited Offer
                            </p>
                            <h3 className="text-white font-bold text-sm truncate">
                                {banner.title}
                            </h3>
                            {banner.subtitle && (
                                <p className="text-white/40 text-xs mt-0.5 truncate">
                                    {banner.subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Prev/Next when multiple */}
                        {visible.length > 1 && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrent(c => (c - 1 + visible.length) % visible.length)}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all text-white/40 hover:text-white"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[9px] font-bold text-white/20 w-8 text-center">
                                    {(current % visible.length) + 1}/{visible.length}
                                </span>
                                <button
                                    onClick={() => setCurrent(c => (c + 1) % visible.length)}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all text-white/40 hover:text-white"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {banner.link && (
                            <Link
                                href={banner.link}
                                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-yellow-500/20"
                            >
                                {banner.ctaText || 'Shop Now'}
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        )}

                        <button
                            onClick={() => dismiss(banner._id)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white/60 transition-all"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.04]" />
            </motion.div>
        </AnimatePresence>
    );
}
