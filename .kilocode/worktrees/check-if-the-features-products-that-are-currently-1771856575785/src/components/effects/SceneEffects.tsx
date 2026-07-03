"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export function AnimatedConnector() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
            style={{ minHeight: 64 }}
        >
            {/* Animated Line */}
            <motion.div
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-16 origin-top"
                style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(197, 160, 89, 0.4) 20%, rgba(197, 160, 89, 0.6) 50%, rgba(197, 160, 89, 0.4) 80%, transparent 100%)'
                }}
            />

            {/* Animated Diamond Top */}
            <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 45 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 45 } : {}}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
                className="absolute left-1/2 top-0 -translate-x-1/2"
            >
                <div className="w-2.5 h-2.5 border border-gold/60 bg-navy/80 backdrop-blur-sm" />
            </motion.div>

            {/* Animated Diamond Center */}
            <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 45 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 45 } : {}}
                transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <div className="w-3 h-3 border border-gold bg-navy/90 shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
            </motion.div>

            {/* Glowing Dot */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <div className="w-1 h-1 bg-gold rounded-full shadow-[0_0_8px_#c5a059]" />
            </motion.div>

            {/* Animated Diamond Bottom */}
            <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 45 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 45 } : {}}
                transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 200 }}
                className="absolute left-1/2 bottom-0 -translate-x-1/2"
            >
                <div className="w-2 h-2 border border-gold/40 bg-navy/80" />
            </motion.div>
        </motion.div>
    );
}

export function FloatingParticles() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const generatedParticles = [...Array(20)].map((_, i) => ({
            left: `${Math.random() * 100}%`,
            top: `${20 + Math.random() * 60}%`,
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 5,
            yOffset: -100 - Math.random() * 100
        }));
        setParticles(generatedParticles);
    }, []);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
        >
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={isInView ? {
                        opacity: [0, 0.2, 0],
                        y: [0, particle.yOffset, 0],
                        x: Math.sin(i * 30) * 50
                    } : {}}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute w-1 h-1 rounded-full bg-gold/20"
                    style={{
                        left: particle.left,
                        top: particle.top,
                    }}
                />
            ))}
        </motion.div>
    );
}

