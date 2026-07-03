"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TestimonialsSection() {
    const { t } = useTranslation();
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const testimonials = [
        {
            id: "t1",
            initials: "FA",
        },
        {
            id: "t2",
            initials: "JS",
        },
        {
            id: "t3",
            initials: "MA",
        },
    ];

    return (
        <section ref={containerRef} className="py-20 md:py-28 lg:py-32 relative overflow-hidden">
            <div className="container-premium">
                <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden relative min-h-[700px] flex items-center">

                    {/* Background Parallax-like Image */}
                    <div className="absolute inset-0 z-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: "url('/images/testimonial_portrait.jpg')",
                            }}
                        />
                        {/* Shaded Overlays for Text Legibility */}
                        <div className="absolute inset-0 bg-navy/90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/50" />

                        {/* Decorative Pattern Overlay */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    </div>

                    <div className="relative z-10 w-full p-8 md:p-16 lg:p-24">
                        {/* Section Header */}
                        <div className="flex flex-col items-center text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                className="w-20 h-20 rounded-2xl bg-gold/10 flex items-center justify-center mb-8 border border-gold/20"
                            >
                                <Quote className="w-10 h-10 text-gold" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.1 }}
                                className="flex items-center gap-4 mb-4"
                            >
                                <div className="w-8 h-px bg-gold/50" />
                                <span className="micro-label">{t('home.testimonials.label')}</span>
                                <div className="w-8 h-px bg-gold/50" />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.2 }}
                                className="heading-md"
                            >
                                {t('home.testimonials.title_prefix')}<span className="text-gradient-gold">{t('home.testimonials.title_accent')}</span>
                            </motion.h2>
                        </div>

                        {/* Testimonials Grid */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                                    className="group"
                                >
                                    <div className="glass-premium rounded-3xl p-8 md:p-10 h-full border border-white/5 hover:border-gold/30 transition-all duration-500 flex flex-col relative overflow-hidden">
                                        {/* Subtle Glow Background */}
                                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 blur-[80px] rounded-full group-hover:bg-gold/10 transition-colors" />

                                        {/* Stars */}
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                                            ))}
                                        </div>

                                        <p className="text-body-lg text-white/70 mb-10 leading-relaxed italic relative z-10">
                                            "{t(`home.testimonials.${testimonial.id}.quote`)}"
                                        </p>

                                        {/* Author Block */}
                                        <div className="mt-auto flex items-center gap-4 relative z-10 pt-8 border-t border-white/5">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center text-navy font-bold text-xl shadow-lg ring-4 ring-gold/10">
                                                {testimonial.initials}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-lg group-hover:text-gold transition-colors">
                                                    {t(`home.testimonials.${testimonial.id}.author`)}
                                                </div>
                                                <div className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                                                    {t(`home.testimonials.${testimonial.id}.role`)}
                                                </div>
                                                <div className="text-[10px] text-gold font-medium mt-0.5 opacity-70">
                                                    {t(`home.testimonials.${testimonial.id}.company`)}
                                                </div>
                                            </div>
                                        </div>
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
