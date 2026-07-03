'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Clock, FileText, ArrowRight, Phone, ShieldCheck, Award, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { FloatingParticles, AnimatedConnector } from "@/components/effects/SceneEffects";

const warrantyPlans = [
    {
        name: 'Standard Coverage',
        duration: '6 Months',
        coverage: 'Core engine components, turbochargers, and primary hydraulic pumps.',
        price: 'INCLUDED',
        features: ['OEM defect protection', 'Standard labor coverage', 'Regional service network'],
        icon: Shield
    },
    {
        name: 'Extended Industrial',
        duration: '12 Months',
        coverage: 'Full mechanical chain coverage including electrical sensor arrays and cooling systems.',
        price: '+12.5% PART COST',
        features: ['Priority dispatch', 'Semi-annual health check', 'Extended labor support', '24/7 technical hotline'],
        popular: true,
        icon: ShieldCheck
    },
    {
        name: 'Enterprise Precision',
        duration: '24 Months',
        coverage: 'Bespoke full-system coverage including wear-heavy chassis and transmission modules.',
        price: '+22.0% PART COST',
        features: ['Everything in Extended', 'Predictive failure analysis', 'Guaranteed field stock', 'Dedicated technical liaison'],
        icon: Award
    },
];

const categories = [
    {
        category: 'Heavy Engine Parts',
        duration: '12 Months',
        coverage: 'Blocks, heads, pistons, camshafts, and crankshaft assemblies.',
        exclusions: 'Gaskets, seals, and consumable fluids.',
    },
    {
        category: 'Turbo-Systems',
        duration: '12 Months',
        coverage: 'Centrifugal assemblies, compressor wheels, and bypass valves.',
        exclusions: 'Damage from oil starvation or foreign object ingestion.',
    },
    {
        category: 'Hydraulic Dynamics',
        duration: '8 Months',
        coverage: 'Variable displacement pumps, high-pressure motors, and control blocks.',
        exclusions: 'Seal leakage due to contaminated fluid usage.',
    },
    {
        category: 'Precision Electronics',
        duration: '6 Months',
        coverage: 'Engine Control Modules (ECM), sensor arrays, and wiring harnesses.',
        exclusions: 'Voltage surges or water ingress due to improper sealing.',
    },
    {
        category: 'Power Train',
        duration: '12 Months',
        coverage: 'Final drives, planetary gears, and transmission clutch packs.',
        exclusions: 'Normal friction plate wear or operator-induced torque spikes.',
    },
    {
        category: 'Structural Undercarriage',
        duration: '6 Months',
        coverage: 'Tensioners, idlers, and structural roller assemblies.',
        exclusions: 'Track shoe wear and link elongation from high-impact use.',
    },
];

export default function WarrantyPage() {
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
                                <BreadcrumbPage className="text-gold uppercase text-[10px] tracking-[0.2em] font-bold underline underline-offset-4 decoration-gold/30">WARRANTY & ASSURANCE</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="mb-20 text-center max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="micro-label mb-6 block">PROFESSIONAL ASSURANCES</span>
                    <h1 className="heading-lg mb-6 leading-tight">Uptime <span className="text-gradient-gold">Guaranteed.</span><br />Quality <span className="text-gradient-gold">Verified.</span></h1>
                    <p className="text-xl text-white/50 leading-relaxed font-medium">
                        Saudi Horizon stands behind every OEM and certified aftermarket part.
                        Our comprehensive warranty framework ensures that your capital
                        investments remain operational in the harshest industrial environments.
                    </p>
                </motion.div>

                {/* Warranty Plans */}
                <div className="grid lg:grid-cols-3 gap-8 mb-32">
                    {warrantyPlans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`card-premium group h-full transition-all duration-500 overflow-hidden text-center p-12 lg:p-14 ${plan.popular ? 'border-gold/50 bg-gold/[0.04]' : 'border-white/5 bg-navy/40'}`}>
                                <div className={`w-20 h-20 rounded-3xl mx-auto mb-10 flex items-center justify-center border transition-all duration-500 ${plan.popular ? 'bg-gold/20 border-gold/40' : 'bg-white/5 border-white/10 group-hover:bg-gold/10 group-hover:border-gold/30'}`}>
                                    <plan.icon className={`w-10 h-10 ${plan.popular ? 'text-gold' : 'text-white/30 group-hover:text-gold'}`} />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2 tracking-tight group-hover:text-gold transition-colors">{plan.name}</h3>
                                <p className="text-xl font-black text-gold mb-8 uppercase tracking-[0.1em]">{plan.duration}</p>

                                <div className="h-px bg-white/5 w-12 mx-auto mb-8" />

                                <p className="text-sm text-white/50 mb-10 leading-relaxed font-medium px-4">
                                    {plan.coverage}
                                </p>

                                <ul className="space-y-5 text-left mb-12 max-w-[240px] mx-auto">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-center gap-3 text-[11px] font-black text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">
                                            <CheckCircle className="w-4 h-4 text-gold/40" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto">
                                    <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/5 inline-block px-10">
                                        <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em] block mb-1">PLAN FEE</span>
                                        <span className="text-2xl font-black text-white tracking-tighter">{plan.price}</span>
                                    </div>
                                    <Button
                                        onClick={() => router.push('/contact')}
                                        className={`w-full h-16 text-xs font-black uppercase tracking-[0.3em] rounded-xl transition-all duration-500 ${plan.popular ? 'btn-primary shadow-[0_10px_30px_rgba(197,160,89,0.3)]' : 'bg-white/5 border border-white/10 text-white hover:border-gold/50'}`}
                                    >
                                        Activate Coverage
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <AnimatedConnector />

                {/* Category Grid */}
                <div className="mb-32 pt-20">
                    <div className="text-center mb-16">
                        <span className="micro-label mb-6 block">COMPONENT SPECIFICS</span>
                        <h2 className="heading-md tracking-tighter">Detailed Coverage <span className="text-gradient-gold">Matrix.</span></h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={cat.category}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/[0.08] transition-all duration-300 relative group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                                    <Zap className="w-12 h-12 text-gold" />
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-xs font-black text-gold uppercase tracking-[0.2em]">{cat.duration}</span>
                                    <div className="h-px flex-1 bg-white/10" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-gold transition-colors">{cat.category}</h4>
                                <p className="text-sm text-white/50 mb-6 leading-relaxed bg-navy/40 p-4 rounded-xl border border-white/5 italic">
                                    "{cat.coverage}"
                                </p>
                                <div className="flex items-start gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                    <span>Exclusions: {cat.exclusions}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Claim Process */}
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="micro-label mb-6 block">PROCEDURES</span>
                        <h2 className="heading-md mb-8 tracking-tighter">Accelerated Claim <br /><span className="text-gradient-gold">Validation.</span></h2>
                        <p className="text-body-lg text-white/50 leading-relaxed mb-10">
                            Our "Industrial-First" claim policy prioritizes operational continuity. We aim
                            for 72-hour validation on standard component failures to minimize site disruption.
                        </p>
                        <div className="space-y-8">
                            {[
                                { step: '01', title: 'Submit Technical Log', desc: 'Provide part number, installation date, and digital failure logs/photos.' },
                                { step: '02', title: 'Critical Evaluation', desc: 'Our engineers assess the failure point against OEM specifications within 24 hours.' },
                                { step: '03', title: 'Rapid Dispatch', desc: 'Approved claims trigger immediate inventory release for the replacement unit.' },
                            ].map((s, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    <div className="text-4xl font-black text-gold/20 group-hover:text-gold transition-colors duration-500 leading-none">{s.step}</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-gold transition-colors">{s.title}</h4>
                                        <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="glass-premium p-12 border-gold/20 bg-gradient-to-br from-gold/10 to-navy text-center">
                            <Shield className="w-16 h-16 text-gold mx-auto mb-8" />
                            <h3 className="text-4xl font-black text-white mb-6 tracking-tight">Need Urgent Technical Assistance?</h3>
                            <p className="text-lg text-white/50 leading-relaxed mb-10">
                                Our technical assurance team is available for deep-dive diagnostics
                                on persistent component failures and large-scale fleet warranties.
                            </p>
                            <Button
                                onClick={() => router.push('/contact')}
                                className="btn-primary px-12 h-16 text-base font-black uppercase tracking-[0.2em] shadow-xl"
                            >
                                Contact Warranty Team
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <div className="mt-8 flex justify-center gap-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-gold/40" /> 8AM - 8PM AST</span>
                                <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-gold/40" /> Response &lt; 4H</span>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
        </div>
    );
}
