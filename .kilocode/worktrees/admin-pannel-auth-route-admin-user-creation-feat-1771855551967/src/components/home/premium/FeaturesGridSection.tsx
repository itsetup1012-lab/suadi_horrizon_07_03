"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield, Clock, Users, Truck, Wrench, Settings } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Shield,
        title: "OEM Genuine Parts",
        description: "Certified by original equipment manufacturers, guaranteeing exact fit and performance.",
        href: "/about",
    },
    {
        icon: Clock,
        title: "Express Delivery",
        description: "Critical parts delivered across the Middle East within 24 hours to minimize downtime.",
        href: "/shipping",
    },
    {
        icon: Users,
        title: "Technical Support",
        description: "Seasoned engineers help you identify the right component—first time, every time.",
        href: "/contact",
    },
    {
        icon: Wrench,
        title: "Expert Installation",
        description: "Certified technicians available for on-site installation and maintenance.",
        href: "/installation",
    },
    {
        icon: Truck,
        title: "Global Logistics",
        description: "Strategic freight partnerships ensure safe and timely deliveries worldwide.",
        href: "/shipping",
    },
    {
        icon: Settings,
        title: "Quality Assurance",
        description: "Rigorous inspection protocols and comprehensive warranties back every product.",
        href: "/warranty",
    },
];

export function FeaturesGridSection() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    return (
        <section className="py-20 md:py-28 lg:py-32 relative overflow-hidden">
            <div className="container-premium">
                <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-12 md:p-20 lg:p-24 relative overflow-hidden mx-auto w-full">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-3xl mx-auto mb-20"
                        >
                            <span className="micro-label mb-6 block tracking-[0.3em]">WHY CHOOSE US</span>
                            <h2 className="heading-md mb-8">Built Different</h2>
                            <p className="text-body-lg text-white/60 leading-relaxed">
                                We're not just a parts supplier. We're your strategic partner in keeping
                                heavy machinery running at peak performance.
                            </p>
                            <div className="w-16 h-px bg-gold/50 mx-auto mt-8" />
                        </motion.div>

                        {/* Features Grid */}
                        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div className="glass-premium rounded-3xl p-10 h-full border border-white/5 hover:border-gold/20 transition-all duration-500 relative">
                                        {/* Icon */}
                                        <div className="w-14 h-14 rounded-2xl bg-gold/5 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-gold/10 transition-colors">
                                            <feature.icon className="w-6 h-6 text-gold/80" />
                                        </div>

                                        {/* Content */}
                                        <h4 className="mb-4 text-xl font-bold tracking-tight text-white group-hover:text-gold transition-colors">
                                            {feature.title}
                                        </h4>
                                        <p className="text-sm text-white/50 mb-8 leading-relaxed font-medium">
                                            {feature.description}
                                        </p>

                                        {/* Learn More Link */}
                                        <Link
                                            href={feature.href}
                                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gold/60 hover:text-gold transition-colors"
                                        >
                                            Learn More
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
