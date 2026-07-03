'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Truck, Globe, BadgeCheck, Clock, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useTranslation } from 'react-i18next';
import { FloatingParticles } from "@/components/effects/SceneEffects";

export default function ShippingPage() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-navy text-white pt-32 pb-20 font-sans relative overflow-hidden">
            <FloatingParticles />
            <div className="container mx-auto px-4 relative z-10">
                <Breadcrumb className="mb-10">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')} className="cursor-pointer">{t('nav.home')}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{t('nav.shipping')}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Truck className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="heading-lg mb-4">{t('shipping.title')}</h1>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        {t('shipping.subtitle')}
                    </p>
                </motion.div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-12 text-center max-w-4xl mx-auto">
                    <p className="text-white/60">
                        <span className="text-gold font-semibold">{t('shipping.last_updated')}</span>
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Section 1: Delivery Network */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <MapPin className="w-6 h-6 text-gold" />
                                    {t('shipping.section1_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('shipping.section1_content')}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                                        <p className="text-gold font-bold">Riyadh</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest">1-2 Days</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                                        <p className="text-gold font-bold">Jeddah</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest">2-3 Days</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                                        <p className="text-gold font-bold">Dammam</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest">1-2 Days</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 2: Rates & Fees */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <BadgeCheck className="w-6 h-6 text-gold" />
                                    {t('shipping.section2_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('shipping.section2_content')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 3: Tracking & Inspection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Clock className="w-6 h-6 text-gold" />
                                    {t('shipping.section3_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('shipping.section3_content')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 4: Heavy Machinery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card className="bg-white/5 border-white/10 border-gold/20 bg-gradient-to-br from-gold/5 via-transparent to-transparent">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Globe className="w-6 h-6 text-gold" />
                                    {t('shipping.section4_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('shipping.section4_content')}</p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => router.push('/contact')}
                                        className="flex items-center gap-2 text-gold font-bold hover:underline"
                                    >
                                        Contact Logistics Team
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Industrial Compliance Note */}
                <motion.div
                    className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-center mt-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] mb-4">Industrial Compliance Note</p>
                    <p className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed italic">
                        All heavy component shipments are secured under technical transit insurance.
                        Hazardous materials may require specialized handling subject to regional safety regulations.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
