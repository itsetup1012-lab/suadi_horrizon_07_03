'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Settings, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function HomeCTASection() {
    const { t } = useTranslation();
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    return (
        <section ref={containerRef} className="py-20 md:py-28 lg:py-32 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full bg-navy" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-full opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>

            <div className="container-premium relative z-10">
                <div className="glass-premium rounded-3xl p-8 md:p-12 lg:px-10 lg:py-16 border border-white/5 overflow-hidden relative">
                    {/* Animated Glow */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 blur-[120px] rounded-full animate-pulse" />

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="micro-label mb-6 block text-gold uppercase">{t('home.cta.label')}</span>
                            <h2 className="heading-lg mb-6">
                                {t('home.cta.title_prefix')}<span className="text-gradient-gold">{t('home.cta.title_accent')}</span>{t('home.cta.title_suffix')}
                            </h2>
                            <p className="text-body-lg text-white/70 mb-10 max-w-xl leading-relaxed">
                                {t('home.cta.subtitle')}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/contact" className="btn-primary group">
                                    {t('home.cta.cta_consult')}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                                </Link>
                                <Link href="/products" className="btn-secondary">
                                    {t('home.cta.cta_catalog')}
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="grid grid-cols-2 gap-5"
                        >
                            <div className="space-y-5">
                                <div className="bg-white/5 backdrop-blur-md p-7 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors">
                                    <ShieldCheck className="w-11 h-11 text-gold mb-4" />
                                    <h4 className="text-white font-bold mb-2 text-lg">{t('home.cta.oem_title')}</h4>
                                    <p className="text-sm text-white/50">{t('home.cta.oem_desc')}</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md p-7 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors translate-x-5 rtl:-translate-x-5">
                                    <Zap className="w-11 h-11 text-gold mb-4" />
                                    <h4 className="text-white font-bold mb-2 text-lg">{t('home.cta.logistics_title')}</h4>
                                    <p className="text-sm text-white/50">{t('home.cta.logistics_desc')}</p>
                                </div>
                            </div>
                            <div className="space-y-5 pt-10">
                                <div className="bg-white/5 backdrop-blur-md p-7 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors">
                                    <Settings className="w-11 h-11 text-gold mb-4" />
                                    <h4 className="text-white font-bold mb-2 text-lg">{t('home.cta.support_title')}</h4>
                                    <p className="text-sm text-white/50">{t('home.cta.support_desc')}</p>
                                </div>
                                <div className="bg-gold p-7 rounded-2xl border border-gold/10 flex flex-col justify-center items-center text-center -translate-x-5 rtl:translate-x-5">
                                    <div className="text-4xl font-bold text-navy mb-1 uppercase">{t('home.cta.response_time')}</div>
                                    <div className="text-xs font-bold text-navy/70 uppercase tracking-widest">{t('home.cta.response_label')}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
