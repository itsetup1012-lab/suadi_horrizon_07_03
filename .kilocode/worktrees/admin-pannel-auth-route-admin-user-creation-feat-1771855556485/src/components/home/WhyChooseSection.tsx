"use client";

import { ShieldCheck, Atom, Globe, Truck, Award, Clock, Wrench, Headphones } from "lucide-react";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const features = [
    {
        icon: ShieldCheck,
        title: "Reliability",
        description: "Uncompromising quality control for components that withstand the most extreme operational stresses.",
    },
    {
        icon: Atom,
        title: "Innovation",
        description: "Utilizing advanced engineering data to source parts that optimize fuel efficiency and machine longevity.",
    },
    {
        icon: Globe,
        title: 'OEM-Certified Parts',
        description: 'Genuine components from authorized distributors with full certification',
    },
    {
        icon: Truck,
        title: 'Regional Distribution',
        description: 'Express delivery network across the Middle East with tracking',
    },
    {
        icon: Award,
        title: '15+ Years Expertise',
        description: 'Industry-leading experience in heavy equipment supply chain',
    },
    {
        icon: Clock,
        title: '24/7 Technical Support',
        description: 'Round-the-clock assistance for urgent part identification',
    },
    {
        icon: Wrench,
        title: 'Specification Guidance',
        description: 'Expert technical consultation for compatibility verification',
    },
    {
        icon: Headphones,
        title: 'Account Management',
        description: 'Dedicated support for bulk orders and fleet maintenance',
    },
];

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut"
        }
    })
};

export function WhyChooseSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-32 bg-charcoal relative border-t border-white/5 overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block font-display">Why Choose Us</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-display mb-6 leading-tight">
                            Engineering Excellence &{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">Unmatched Reliability</span>
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed font-light">
                            We don't just supply parts; we deliver peace of mind. Our rigorous quality standards and deep technical expertise ensure that your machinery operates at peak performance.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                            <img
                                src="/images/why_choose_bg.png"
                                alt="Industrial Excellence"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60" />
                        </div>
                        {/* Decorative Badge */}
                        <div className="absolute -bottom-6 -right-6 glass p-6 border-l-4 border-gold hidden md:block">
                            <div className="text-3xl font-bold text-white mb-1">15+ Years</div>
                            <div className="text-xs text-gold uppercase tracking-widest font-bold">Industrial Expertise</div>
                        </div>
                    </motion.div>
                </div>

                {/* Modern Bento Grid - 4 columns on large screens */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            custom={index}
                            className={`group relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-gold/40 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                                }`}
                        >
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
                            </div>

                            {/* Corner accents */}
                            <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-gold/30 rounded-tr-lg" />
                            </div>

                            <div className="relative z-10">
                                <motion.div
                                    className="mb-4 inline-flex items-center justify-center w-14 h-14 bg-white/5 rounded-xl group-hover:bg-gold/20 transition-colors duration-300 border border-white/10 group-hover:border-gold/50"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                >
                                    <feature.icon className="w-7 h-7 text-gold transition-transform group-hover:scale-110" />
                                </motion.div>
                                <h4 className="text-white font-bold mb-2 font-display text-lg group-hover:text-gold transition-colors duration-300">{feature.title}</h4>
                                <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Bottom line indicator */}
                            <motion.div
                                className="absolute bottom-0 left-0 h-0.5 bg-gold"
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
