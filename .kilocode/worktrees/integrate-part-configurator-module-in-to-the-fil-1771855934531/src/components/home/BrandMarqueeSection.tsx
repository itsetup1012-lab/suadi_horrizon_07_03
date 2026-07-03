"use client";

import { motion } from "framer-motion";

const brands = [
    { name: 'CATERPILLAR', logo: 'https://www.vectorlogo.zone/logos/caterpillar/caterpillar-ar21.svg' },
    { name: 'JCB', logo: 'https://www.vectorlogo.zone/logos/jcb/jcb-ar21.svg' },
    { name: 'PERKINS', logo: 'https://www.vectorlogo.zone/logos/perkins/perkins-ar21.svg' },
    { name: 'CUMMINS', logo: 'https://www.vectorlogo.zone/logos/cummins/cummins-ar21.svg' },
    { name: 'KMP', logo: 'https://www.vectorlogo.zone/logos/kmparts/kmparts-ar21.svg' },
    { name: 'KOMATSU', logo: 'https://www.vectorlogo.zone/logos/komatsu/komatsu-ar21.svg' },
    { name: 'VOLVO', logo: 'https://www.vectorlogo.zone/logos/volvo/volvo-ar21.svg' },
];

export function BrandMarqueeSection() {
    return (
        <section className="py-24 bg-surface border-y border-white/5 overflow-hidden relative">
            {/* Animated background */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

            {/* Gradient orbs */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-900/5 rounded-full blur-3xl -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 mb-12">
                <motion.p
                    className="text-center text-gold/60 text-xs font-bold uppercase tracking-[0.3em] font-display"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Trusted by Industry Leaders
                </motion.p>
            </div>

            <div className="relative flex items-center">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface to-transparent z-10"></div>

                <div className="flex overflow-hidden py-4">
                    <motion.div
                        className="flex gap-16 md:gap-24 pr-16 md:pr-24"
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 25,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {/* Duplicate the array 4 times to ensure smooth looping */}
                        {[...brands, ...brands, ...brands, ...brands].map((brand, index) => (
                            <motion.div
                                key={index}
                                className="flex-shrink-0 group relative"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gold/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 bg-white/[0.02] px-6 py-4 rounded-lg border border-white/5 group-hover:border-gold/30 transition-colors duration-300">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="h-10 md:h-12 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 brightness-150 group-hover:brightness-100"
                                    />
                                </div>

                                {/* Brand name tooltip */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    <span className="text-[10px] text-gold uppercase tracking-wider">{brand.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Bottom decoration line */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
            />
        </section>
    );
}
