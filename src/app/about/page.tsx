'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Award, Users, ShieldCheck, Truck, ArrowRight, CheckCircle2, Factory, Zap, Target } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { FloatingParticles, AnimatedConnector } from "@/components/effects/SceneEffects";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
    const router = useRouter();
    const timelineRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true });

    const stats = [
        { icon: Award, label: '15+ Years', description: 'INDUSTRY LEADERSHIP', color: 'text-gold' },
        { icon: Users, label: '1000+', description: 'BUSINESS ACCOUNTS', color: 'text-gold' },
        { icon: ShieldCheck, label: '5+ Brands', description: 'OFFICIAL PARTNERS', color: 'text-gold' },
        { icon: Truck, label: '720+ Parts', description: 'READY FOR SHIPPING', color: 'text-gold' },
    ];

    const timeline = [
        { year: '2008', title: 'Company Founded', description: 'Started operations in Riyadh with a focus on Caterpillar parts' },
        { year: '2012', title: 'Regional Expansion', description: 'Expanded to serve clients across the Middle East region' },
        { year: '2016', title: 'OEM Partnerships', description: 'Secured authorized dealer status with JCB, Perkins, and Cummins' },
        { year: '2020', title: 'Digital Transformation', description: 'Launched online ordering platform for faster service' },
        { year: '2024', title: 'Industry Leader', description: 'Recognized as a top supplier with 1000+ active business accounts' },
    ];

    const brandLogos = [
        { name: 'CATERPILLAR', icon: Target },
        { name: 'JCB', icon: Factory },
        { name: 'PERKINS', icon: Zap },
        { name: 'CUMMINS', icon: ShieldCheck },
        { name: 'KMP', icon: CheckCircle2 }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const milestones = timelineRef.current?.querySelectorAll('.timeline-milestone');
            if (milestones && milestones.length > 0) {
                gsap.fromTo(
                    milestones,
                    { opacity: 0, x: -30 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.5,
                        stagger: 0.15,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: timelineRef.current,
                            start: 'top 70%',
                        },
                    }
                );
            }
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="text-white pb-24 relative overflow-hidden" ref={containerRef}>
            {/* Ambient Background */}
            <FloatingParticles />

            <div className="container-premium relative z-10">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => router.push('/')} className="hover:text-gold cursor-pointer transition-colors text-slate-400 uppercase text-[10px] tracking-[0.2em] font-bold">HOME</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-slate-600" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-gold uppercase text-[10px] tracking-[0.2em] font-bold underline underline-offset-4 decoration-gold/30">ABOUT US</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </motion.div>

                {/* Hero Section */}
                <div className="mb-32 text-center max-w-4xl mx-auto pt-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="micro-label mb-6 block">OUR MISSION</span>
                        <h1 className="text-6xl md:text-7xl font-black mb-10 leading-[0.9] tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                            Built on <span className="text-gradient-gold">precision.</span><br />
                            Driven by <span className="text-gradient-gold">performance.</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-white/60 mb-12 leading-relaxed"
                    >
                        Saudi Horizon Co. delivers OEM-certified heavy equipment parts across the Middle East.
                        The industrial backbone your operations deserve.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        <Button
                            size="lg"
                            className="btn-primary px-10 h-14 text-base"
                            onClick={() => router.push('/products')}
                        >
                            Explore Catalog
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-10 h-14 text-base"
                            onClick={() => router.push('/contact')}
                        >
                            Speak with Experts
                        </Button>
                    </motion.div>
                </div>

                <AnimatedConnector />

                {/* Vertical Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 pt-20">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="card-premium group relative overflow-hidden text-center p-10 border-white/5 bg-navy/40 backdrop-blur-sm"
                            >
                                {/* Hover background glow */}
                                <div className="absolute -inset-1 bg-gradient-to-b from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />

                                <Icon className={`w-12 h-12 mx-auto mb-6 ${stat.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`} />
                                <h3 className="text-5xl font-black text-white mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>{stat.label}</h3>
                                <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">{stat.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                <AnimatedConnector />

                {/* Story and Timeline Split */}
                <div className="grid lg:grid-cols-5 gap-20 mb-32 items-start pt-20">
                    <div className="lg:col-span-2 lg:sticky lg:top-32">
                        <span className="micro-label mb-6 block">OUR HISTORY</span>
                        <h2 className="heading-md mb-8 tracking-tighter">A Decade of Industrial Reliability</h2>
                        <div className="space-y-6 text-body-lg text-white/50 leading-relaxed">
                            <p>
                                Saudi Horizon started as a specialized component supplier in Riyadh with a singular focus:
                                uncompromising quality for the construction and mining sectors.
                            </p>
                            <p>
                                Today, we are the first-choice partner for thousands of contractors who refuse
                                to compromise on uptime. Our supply chain ensures that genuine parts are never more
                                than 24 hours away.
                            </p>
                        </div>
                        <div className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                                <ShieldCheck className="w-8 h-8 text-gold" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Quality Certified</h4>
                                <p className="text-sm text-white/40 uppercase tracking-widest font-bold">ISO 9001:2015 Standards</p>
                            </div>
                        </div>
                    </div>

                    <div ref={timelineRef} className="lg:col-span-3 space-y-12 relative pl-4 lg:pl-0">
                        {/* Timeline vertical line */}
                        <div className="absolute left-[19px] top-6 bottom-6 w-px bg-gradient-to-b from-gold/50 via-gold/10 to-transparent" />

                        {timeline.map((milestone, index) => (
                            <div key={index} className="timeline-milestone relative pl-16 group">
                                {/* Timeline bubble */}
                                <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-navy border border-white/10 flex items-center justify-center z-10 group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
                                    <div className="w-2 h-2 rounded-full bg-gold group-hover:bg-navy" />
                                </div>

                                <motion.div
                                    className="bg-white/5 border border-white/5 p-8 rounded-2xl group-hover:border-gold/30 transition-all duration-300"
                                    whileHover={{ x: 10 }}
                                >
                                    <span className="text-xs font-black text-gold tracking-[0.3em] mb-3 block">{milestone.year}</span>
                                    <h4 className="text-2xl font-bold mb-4 text-white tracking-tight">{milestone.title}</h4>
                                    <p className="text-body-md text-white/40 leading-relaxed">{milestone.description}</p>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatedConnector />

                {/* Authorized Brands Marquee-style Grid */}
                <div className="mb-32 pt-20">
                    <div className="text-center mb-16">
                        <span className="micro-label mb-6 block">ECOSYSTEM</span>
                        <h2 className="heading-md tracking-tighter">Authorized Parts Partners</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {brandLogos.map((brand, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="bg-navy/40 border border-white/5 hover:border-gold/30 hover:bg-white/5 transition-all duration-300 rounded-3xl py-12 px-8 text-center group"
                            >
                                <brand.icon className="w-12 h-12 mx-auto mb-6 text-white/20 group-hover:text-gold transition-colors duration-500" />
                                <p className="font-black text-lg text-white/40 group-hover:text-white transition-colors tracking-[0.2em]">
                                    {brand.name}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Partner CTA */}
                <div className="glass-premium rounded-[3rem] p-16 lg:p-24 border border-white/10 overflow-hidden relative text-center">
                    {/* Background glow effects */}
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/10 blur-[120px] rounded-full" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold/5 blur-[120px] rounded-full" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                        <span className="micro-label">GROW WITH US</span>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            Scale Your Industrial <br />
                            <span className="text-gradient-gold">Infrastructure.</span>
                        </h2>
                        <p className="text-xl text-white/50 leading-relaxed">
                            Join over 1,000 active business accounts receiving tiered wholesale pricing
                            and priority priority logistics support.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 pt-6">
                            <Button
                                size="lg"
                                className="btn-primary px-12 h-16 text-base font-bold"
                                onClick={() => router.push('/contact')}
                            >
                                Request Partner Account
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="bg-white/5 border-white/10 hover:bg-white/10 text-white px-12 h-16 text-base font-bold"
                                onClick={() => router.push('/products')}
                            >
                                View OEM Catalog
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
        </div>
    );
}

