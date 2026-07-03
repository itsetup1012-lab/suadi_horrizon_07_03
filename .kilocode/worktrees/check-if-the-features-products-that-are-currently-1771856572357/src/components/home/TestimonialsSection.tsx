"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useRef } from "react";

const testimonials = [
    {
        id: 1,
        content: "Saudi Horizon provided exceptional service in sourcing hard-to-find parts for our heavy machinery fleet. Their delivery speed minimized our downtime significantly.",
        author: "Fahad Al-Otaibi",
        role: "Operations Director",
        company: "Al-Otaibi Construction",
        rating: 5
    },
    {
        id: 2,
        content: "The quality of the refurbished equipment we purchased was outstanding. It performes like new but at a fraction of the cost. Highly recommended partner.",
        author: "John Smith",
        role: "Fleet Manager",
        company: "Global Logistics Co.",
        rating: 5
    },
    {
        id: 3,
        content: "Their technical support team went above and beyond to help us identify the correct components for our vintage Caterpillar generators.",
        author: "Mohammed Asghar",
        role: "Chief Engineer",
        company: "Power Systems Ltd.",
        rating: 5
    }
];

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.15,
            duration: 0.6,
            ease: "easeOut"
        }
    })
};

export function TestimonialsSection() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    return (
        <section className="py-32 bg-charcoal relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-[128px] pointer-events-none" />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span
                        className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block font-display"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        Client Success Stories
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-display">Trusted by Industry Leaders</h2>
                </motion.div>

                <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-gold/40 hover:bg-white/[0.04] transition-all duration-500"
                        >
                            {/* Quote Icon */}
                            <motion.div
                                className="absolute top-6 right-6 text-gold/10 group-hover:text-gold/30 transition-colors duration-500"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <Quote size={48} />
                            </motion.div>

                            {/* Top accent line */}
                            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Stars */}
                            <motion.div
                                className="flex gap-1 mb-6"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                    >
                                        <Star size={18} fill="#C5A059" className="text-gold" />
                                    </motion.div>
                                ))}
                            </motion.div>

                            <p className="text-slate-300 mb-8 leading-relaxed relative z-10 group-hover:text-slate-200 transition-colors duration-300">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center text-navy font-bold text-lg shadow-lg shadow-gold/20"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    {testimonial.author.charAt(0)}
                                </motion.div>
                                <div className="text-sm">
                                    <div className="text-white font-bold group-hover:text-gold transition-colors duration-300">{testimonial.author}</div>
                                    <div className="text-gold/80 text-xs">{testimonial.role}, {testimonial.company}</div>
                                </div>
                            </div>

                            {/* Bottom glow */}
                            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-gold/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
