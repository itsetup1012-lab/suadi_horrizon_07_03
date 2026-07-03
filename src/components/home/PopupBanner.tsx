'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

interface Banner {
    _id: string;
    title: string;
    subtitle?: string;
    image?: string;
    link?: string;
    ctaText?: string;
    position: string;
}

const DISMISSED_KEY = 'sh_dismissed_popups';

function getDismissed(): Set<string> {
    try {
        const raw = sessionStorage.getItem(DISMISSED_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
}

function saveDismissed(set: Set<string>) {
    try {
        sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...set]));
    } catch { }
}

export function PopupBanner() {
    const [banner, setBanner] = useState<Banner | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show popup after 3-second delay
        const timer = setTimeout(async () => {
            try {
                const res = await fetch('/api/banners?position=popup');
                const data = await res.json();
                const dismissed = getDismissed();
                const available = (data.banners || []).find(
                    (b: Banner) => !dismissed.has(b._id)
                );
                if (available) {
                    setBanner(available);
                    setVisible(true);
                }
            } catch {
                // silently fail
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        if (banner) {
            const dismissed = getDismissed();
            dismissed.add(banner._id);
            saveDismissed(dismissed);
        }
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && banner && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                        onClick={dismiss}
                    />

                    {/* Modal */}
                    <motion.div
                        key="popup"
                        initial={{ opacity: 0, scale: 0.88, y: 32 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 16 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="relative w-full max-w-lg pointer-events-auto overflow-hidden rounded-2xl bg-[#0D1620] border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Top gold accent bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

                            {/* Image */}
                            {banner.image && (
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1620] via-[#0D1620]/30 to-transparent" />

                                    {/* "Limited Offer" badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[9px] font-black uppercase tracking-[0.25em] rounded-lg backdrop-blur-sm">
                                            Limited Offer
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-8">
                                {!banner.image && (
                                    <span className="inline-block mb-4 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[9px] font-black uppercase tracking-[0.25em] rounded-lg">
                                        Limited Offer
                                    </span>
                                )}

                                <h2 className="text-2xl font-black text-white leading-tight mb-3 tracking-tight">
                                    {banner.title}
                                </h2>

                                {banner.subtitle && (
                                    <p className="text-white/50 text-sm leading-relaxed mb-6">
                                        {banner.subtitle}
                                    </p>
                                )}

                                {/* CTA row */}
                                <div className="flex items-center gap-3">
                                    {banner.link ? (
                                        <Link
                                            href={banner.link}
                                            onClick={dismiss}
                                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg shadow-yellow-500/25"
                                        >
                                            {banner.ctaText || 'Shop Now'}
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    ) : null}
                                    <button
                                        onClick={dismiss}
                                        className="flex-1 py-3.5 border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Maybe Later
                                    </button>
                                </div>
                            </div>

                            {/* Dismiss X */}
                            <button
                                onClick={dismiss}
                                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
