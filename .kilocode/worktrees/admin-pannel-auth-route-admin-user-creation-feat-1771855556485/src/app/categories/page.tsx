'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ChevronRight,
    Truck,
    Wrench,
    Zap,
    Battery,
    Settings,
    Hammer,
    Filter,
    Disc,
    Box,
    ArrowRight,
    Quote,
    Package,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { FloatingParticles, AnimatedConnector } from "@/components/effects/SceneEffects";

const categories = [
    {
        id: 'engine',
        name: 'Engine Components',
        description: 'Elite technical specifications for internal combustion. Pistons, gaskets, and heavy-duty assemblies.',
        icon: <Wrench className="w-10 h-10" />,
        count: 1560,
        subcategories: ['Precision Pistons', 'Bearing Systems', 'High-Temp Gaskets', 'Cylinder Heads', 'Turbo Logistics'],
        image: '/images/home/engine.png',
        color: 'from-orange-500/20 to-transparent'
    },
    {
        id: 'transmission',
        name: 'Power Train & Gears',
        description: 'Industrial-grade torque distribution and gear synchronization for heavy machinery.',
        icon: <Settings className="w-10 h-10" />,
        count: 980,
        subcategories: ['Axle Assemblies', 'Differential Systems', 'Drive Shaft Logistics', 'Clutch Packs', 'Gear Synchronization'],
        image: '/images/home/transmission.png',
        color: 'from-purple-500/20 to-transparent'
    },
    {
        id: 'hydraulics',
        name: 'Hydraulic Dynamics',
        description: 'High-pressure fluid logistics and precision control systems for mechanical force.',
        icon: <Disc className="w-10 h-10" />,
        count: 1240,
        subcategories: ['Pressure Pumps', 'Hydraulic Cylinders', 'Flow Valves', 'High-Psi Hoses', 'Force Motors'],
        image: '/images/home/hydraulics.png',
        color: 'from-cyan-500/20 to-transparent'
    },
    {
        id: 'electrical',
        name: 'Industrial Electrical',
        description: 'Critical voltage management, ignition systems, and automated control modules.',
        icon: <Zap className="w-10 h-10" />,
        count: 870,
        subcategories: ['High-Output Alternators', 'Ignition Starters', 'Sensor Arrays', 'Control Modules', 'Data Harnesses'],
        image: '/images/home/electrical.png',
        color: 'from-amber-500/20 to-transparent'
    },
    {
        id: 'undercarriage',
        name: 'Chassis & Logistics',
        description: 'Structural integrity modules, track systems, and ground interaction components.',
        icon: <Truck className="w-10 h-10" />,
        count: 720,
        subcategories: ['Tactical Track Shoes', 'Precision Rollers', 'Idler Logistics', 'Sprocket Gears', 'Strength Chains'],
        image: '/images/home/undercarriage.png',
        color: 'from-emerald-500/20 to-transparent'
    },
    {
        id: 'attachments',
        name: 'Heavy Attachments',
        description: 'Sector-specific excavation, demolition, and material handling capabilities.',
        icon: <Hammer className="w-10 h-10" />,
        count: 1430,
        subcategories: ['High-Volume Buckets', 'Blade Assemblies', 'Demolition Hammers', 'Quick Couplers', 'Cabin Protection'],
        image: '/images/home/attachments.png',
        color: 'from-slate-500/20 to-transparent'
    },
];

function CategoriesPage() {
    const router = useRouter();
    const searchParamsHook = useSearchParams();
    const categoryParam = searchParamsHook.get('category');
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
        if (categoryParam) {
            router.push(`/products?category=${categoryParam}`);
        }
    }, [categoryParam, router]);

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="text-white pb-32 relative overflow-hidden min-h-screen">
            <FloatingParticles />

            <div className="container-premium relative z-10 pt-8">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => router.push('/')} className="hover:text-gold cursor-pointer transition-colors text-slate-400 uppercase text-[10px] tracking-[0.2em] font-bold">HOME</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-slate-600" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-gold uppercase text-[10px] tracking-[0.2em] font-bold underline underline-offset-4 decoration-gold/30">SECTOR DIRECTORY</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </motion.div>

                {/* Hero Section */}
                <div className="mb-20 flex flex-col lg:flex-row gap-12 items-end justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-3xl"
                    >
                        <span className="micro-label mb-4 block">PRODUCT INDEX 0.4</span>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                            Industrial <span className="text-gradient-gold">Sector directory.</span>
                        </h1>
                        <p className="text-white/40 text-sm md:text-lg font-bold uppercase tracking-[0.2em] max-w-2xl leading-relaxed">
                            Navigate professional-grade components by technical sector. Access documented specifications for over 6,800 active inventory items.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-[450px]"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gold/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50 group-hover:text-gold transition-colors" />
                            <Input
                                placeholder="SEARCH SECTOR OR COMPONENT..."
                                className="pl-14 h-16 bg-navy/80 backdrop-blur-xl border-white/10 text-white text-xs font-black tracking-[0.2em] placeholder:text-white/20 focus:border-gold/50 rounded-2xl transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>

                <AnimatedConnector />

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                    <AnimatePresence mode="popLayout">
                        {filteredCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="h-full"
                            >
                                <Card className="card-premium group rounded-[2.5rem] border-white/5 bg-navy/40 backdrop-blur-md hover:border-gold/30 transition-all duration-700 h-full overflow-hidden flex flex-col">
                                    <div className="h-56 overflow-hidden relative">
                                        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} z-10`} />
                                        <div className="absolute inset-0 bg-navy/20 z-10" />
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100"
                                        />
                                        <div className="absolute top-6 left-6 z-20">
                                            <div className="w-20 h-20 rounded-2xl bg-navy/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gold group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                                                {category.icon}
                                            </div>
                                        </div>
                                        <div className="absolute bottom-6 right-6 z-20">
                                            <Badge variant="secondary" className="bg-gold/90 text-navy text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-none shadow-[0_5px_15px_rgba(197,160,89,0.4)] transition-transform group-hover:-translate-y-1">
                                                {category.count}+ COMPONENTS
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="pt-8 pb-4 relative z-20">
                                        <CardTitle className="text-2xl font-black text-white tracking-tight mb-2 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                                            {category.name}
                                        </CardTitle>
                                        <CardDescription className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] leading-[1.6]">
                                            {category.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 flex flex-col relative z-20">
                                        <div className="space-y-3 mb-8">
                                            {category.subcategories.slice(0, 3).map((sub) => (
                                                <div key={sub} className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40 transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                                                    {sub}
                                                </div>
                                            ))}
                                            {category.subcategories.length > 3 && (
                                                <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest pl-4">
                                                    + ANALYSIS OF {category.subcategories.length - 3} ADDITIONAL TECHNICAL GROUPS
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => router.push(`/products?category=${category.id}`)}
                                            className="mt-auto w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gold hover:text-navy hover:border-gold transition-all duration-500 shadow-xl group/btn"
                                        >
                                            IDENTIFY COMPONENTS
                                            <ArrowRight className="ml-3 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>

                                    {/* Glass reflection effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredCategories.length === 0 && (
                    <motion.div
                        className="text-center py-32 rounded-[3.5rem] bg-navy/40 border border-dashed border-white/10 mt-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-navy border border-white/10 mb-8">
                            <Package className="w-10 h-10 text-white/10" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>No Sectors Matched</h2>
                        <p className="text-white/40 uppercase text-[10px] font-black tracking-[0.25em] mb-10">Verification failed for query: "{searchQuery}"</p>
                        <Button
                            className="btn-primary h-14 px-10 rounded-xl"
                            onClick={() => setSearchQuery('')}
                        >
                            Reset System Filter
                        </Button>
                    </motion.div>
                )}

                {/* Logistics Support Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-32 p-10 md:p-16 rounded-[4rem] bg-gradient-to-br from-gold/10 via-navy-light/40 to-navy-dark border border-gold/10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <Quote className="w-64 h-64 text-gold rotate-12" />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 items-center justify-between relative z-10">
                        <div className="flex gap-8 items-start">
                            <div className="w-20 h-20 rounded-[2rem] bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                                <ShieldCheck className="w-10 h-10 text-gold" />
                            </div>
                            <div>
                                <span className="micro-label mb-3 block">LOGISTICS SUPPORT</span>
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                                    Technician <span className="text-gradient-gold">Verification.</span>
                                </h2>
                                <p className="text-white/40 uppercase tracking-[0.15em] text-[10px] md:text-xs font-black max-w-xl leading-relaxed">
                                    Our master technicians are on standby for specialized component identification and hard-to-find technical sourcing.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <Button
                                onClick={() => router.push('/contact')}
                                className="h-16 px-10 rounded-2xl bg-gold text-navy font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_15px_30px_rgba(197,160,89,0.2)] hover:scale-105 transition-all"
                            >
                                Contact Engineering
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/bulk-quote')}
                                className="h-16 px-10 rounded-2xl border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all"
                            >
                                Request Fleet Quote
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
        </div>
    );
}

export default function CategoriesPageWrapper() {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center">
            <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gold"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gold rounded-full animate-ping" />
                </div>
            </div>
        </div>}>
            <CategoriesPage />
        </React.Suspense>
    );
}

