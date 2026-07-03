'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RotateCcw, Shield, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useTranslation } from 'react-i18next';

export default function ReturnsPage() {
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
                            <BreadcrumbPage>{t('nav.returns')}</BreadcrumbPage>
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
                        <RotateCcw className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="heading-lg mb-4">{t('returns.title')}</h1>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        {t('returns.subtitle')}
                    </p>
                </motion.div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8 text-center">
                    <p className="text-white/60">
                        <span className="text-gold font-semibold">{t('returns.last_updated')}</span>
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
                                    <Clock className="w-6 h-6 text-gold" />
                                    {t('returns.section1_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('returns.section1_content')}</p>
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
                                    <AlertCircle className="w-6 h-6 text-gold" />
                                    {t('returns.section2_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('returns.section2_content')}</p>
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
                                    <RefreshCw className="w-6 h-6 text-gold" />
                                    {t('returns.section3_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70 leading-relaxed">
                                <p>{t('returns.section3_content')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
