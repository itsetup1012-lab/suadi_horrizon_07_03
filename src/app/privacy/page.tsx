'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-navy text-white pt-32 pb-20 font-sans">
            <div className="container mx-auto px-4">
                <Breadcrumb className="mb-10">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')}>{t('nav.home')}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{t('privacy.title')}</BreadcrumbPage>
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
                        <Shield className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="heading-lg mb-4">{t('privacy.title')}</h1>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        {t('privacy.subtitle')}
                    </p>
                </motion.div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8 text-center">
                    <p className="text-white/60">
                        <span className="text-gold font-semibold">{t('privacy.last_updated')}</span>
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Globe className="w-6 h-6 text-gold" />
                                    {t('privacy.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('privacy.intro')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Eye className="w-6 h-6 text-gold" />
                                    {t('privacy.section1_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('privacy.section1_content')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Lock className="w-6 h-6 text-gold" />
                                    {t('privacy.section2_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('privacy.section2_content')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Shield className="w-6 h-6 text-gold" />
                                    {t('privacy.section3_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('privacy.section3_content')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-16 max-w-4xl mx-auto glass-premium rounded-2xl p-8 border border-gold/20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold mb-10 text-white text-center">Contact Information</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                                <Mail className="w-6 h-6 text-gold" />
                            </div>
                            <p className="font-semibold text-white mb-1">Email</p>
                            <p className="text-white/50 text-sm">privacy@saudihorizon.online</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                                <Phone className="w-6 h-6 text-gold" />
                            </div>
                            <p className="font-semibold text-white mb-1">Phone</p>
                            <p className="text-white/50 text-sm">+966 57 019 6677</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                                <MapPin className="w-6 h-6 text-gold" />
                            </div>
                            <p className="font-semibold text-white mb-1">Address</p>
                            <p className="text-white/50 text-sm">Riyadh, Saudi Arabia</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
