'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, Globe, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useRouter } from 'next/navigation';
import { FloatingParticles, AnimatedConnector } from "@/components/effects/SceneEffects";

const shippingOptions = [
    {
        icon: <Truck className="w-8 h-8" />,
        title: 'Standard Ground',
        price: 'SAR 45',
        timeframe: '3-5 Business Days',
        description: 'Reliable freight logistics for heavy components and bulk orders.',
        features: ['Full tracking', 'Insurance included', 'Standard handling']
    },
    {
        icon: <Zap className="w-8 h-8 text-gold" />,
        title: 'Express Air',
        price: 'SAR 120',
        timeframe: '1-2 Business Days',
        description: 'Priority aerial logistics for critical downtime components.',
        features: ['Next-day priority', 'Special handling', 'Premium tracking'],
        popular: true
    },
    {
        icon: <Clock className="w-8 h-8" />,
        title: 'Mission Critical',
        price: 'Custom',
        timeframe: 'Same Day / < 24H',
        description: 'Dedicated courier for non-negotiable operational uptime.',
        features: ['Dedicated transport', 'Site-direct delivery', 'Real-time GPS']
    },
];

const regions = [
    { area: 'Riyadh Province', time: '1-2 Days', type: 'Priority Hub' },
    { area: 'Eastern Province', time: '1-2 Days', type: 'Industrial Zone' },
    { area: 'Makkah Region', time: '2-3 Days', type: 'Logistics Node' },
    { area: 'Madinah Region', time: '2-3 Days', type: 'Standard Node' },
    { area: 'Qassim & North', time: '3-4 Days', type: 'Extended Zone' },
    { area: 'Southern Frontier', time: '3-5 Days', type: 'Extended Zone' },
];

export default function ShippingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-navy text-white pb-24 relative overflow-hidden">
            <FloatingParticles />

            <div className="container-premium relative z-10">
                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 pt-10"
                >
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => router.push('/')} className="hover:text-gold cursor-pointer transition-colors text-slate-400 uppercase text-[10px] tracking-[0.2em] font-bold">HOME</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-slate-600" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-gold uppercase text-[10px] tracking-[0.2em] font-bold underline underline-offset-4 decoration-gold/30">SHIPPING & LOGISTICS</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </motion.div>

                {/* Header Section */}
                <motion.div
                    className="mb-20 text-center max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="micro-label mb-6 block">LOGISTICS NETWORK</span>
                    <h1 className="heading-lg mb-6 leading-tight">Precision <span className="text-gradient-gold">Logistics.</span><br />Maximum <span className="text-gradient-gold">Uptime.</span></h1>
                    <p className="text-xl text-white/50 leading-relaxed font-medium">
                        Strategically positioned supply hubs across Saudi Arabia and the GCC ensure your heavy
                        machinery never stays idle. Verified part delivery in as little as 24 hours.
                    </p>
                </motion.div>

                {/* Shipping Tiers */}
                <div className="grid lg:grid-cols-3 gap-8 mb-20">
                    {shippingOptions.map((option, index) => (
                        <motion.div
                            key={option.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`card-premium group h-full transition-all duration-500 overflow-hidden ${option.popular ? 'border-gold/40 bg-gold/[0.03]' : 'border-white/5 bg-navy/40'}`}>
                                {option.popular && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-gold text-navy text-[10px] font-black px-4 py-1 uppercase tracking-widest rounded-bl-xl shadow-lg">Most Requested</div>
                                    </div>
                                )}
                                <CardHeader className="p-8 pb-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-colors duration-500 ${option.popular ? 'bg-gold/10 border-gold/30' : 'bg-white/5 border-white/10 group-hover:bg-gold/10 group-hover:border-gold/30'}`}>
                                        <div className={option.popular ? 'text-gold' : 'text-white/40 group-hover:text-gold transition-colors'}>{option.icon}</div>
                                    </div>
                                    <CardTitle className="text-2xl font-bold tracking-tight text-white group-hover:text-gold transition-colors">{option.title}</CardTitle>
                                    <CardDescription className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] pt-1">{option.timeframe}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0">
                                    <div className="mb-6">
                                        <span className="text-4xl font-black text-white">{option.price}</span>
                                        {option.price !== 'Custom' && <span className="text-white/30 text-xs ml-2 uppercase tracking-widest font-bold">Min Base</span>}
                                    </div>
                                    <p className="text-sm text-white/60 mb-8 leading-relaxed italic">
                                        "{option.description}"
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        {option.features.map(f => (
                                            <li key={f} className="flex items-center gap-3 text-xs font-bold text-white/50 tracking-wide">
                                                <ShieldCheck className="w-4 h-4 text-gold/60" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <AnimatedConnector />

                {/* Regional Grid */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20 pt-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="micro-label mb-6 block">TERRITORY COVERAGE</span>
                        <h2 className="heading-md mb-8 tracking-tighter">Verified Regional <br /><span className="text-gradient-gold">Turnaround Times.</span></h2>
                        <div className="space-y-4">
                            {regions.map((region, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-gold/30 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                                        <div>
                                            <span className="text-sm font-bold text-white group-hover:text-gold transition-colors">{region.area}</span>
                                            <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">{region.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-black text-gold tracking-widest">{region.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="card-premium p-12 lg:p-16 border-gold/20 bg-gradient-to-br from-gold/10 via-navy/80 to-navy overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Globe className="w-48 h-48 text-gold" />
                            </div>
                            <Package className="w-16 h-16 text-gold mb-8 italic" />
                            <h3 className="text-3xl font-black text-white mb-6 leading-tight tracking-tight">Enterprise & <br />GCC Logistics</h3>
                            <p className="text-lg text-white/50 leading-relaxed mb-10">
                                For cross-border industrial projects and fleet-wide seasonal parts stocking,
                                we provide curated logistics solutions including customs clearance handling
                                for Kuwait, UAE, Bahrain, Oman, and Qatar.
                            </p>
                            <Button
                                onClick={() => router.push('/contact')}
                                className="btn-primary px-10 h-14 text-base font-bold shadow-lg"
                            >
                                Request Logistics Quote
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Policy Footer */}
                <motion.div
                    className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-center mt-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] mb-4">Industrial Compliance Note</p>
                    <p className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed italic">
                        All heavy component shipments are secured under technical transit insurance.
                        Hazardous materials (batteries/fluids) may require specialized handling routes
                        subject to regional safety regulations.
                    </p>
                </motion.div>
            </div>

            {/* Bottom Section Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
        </div>
    );
}
