"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus, HelpCircle, MessageCircle } from "lucide-react";

const faqs = [
    {
        question: "How do I ensure part compatibility for my Caterpillar equipment?",
        answer: "We offer advanced cross-referencing for all major OEM part numbers. Simply provide your machine serial number to our experts, and we will verify the exact fitment using our proprietary database, ensuring 100% compatibility before shipment."
    },
    {
        question: "What is the typical shipping lead time across the Kingdom?",
        answer: "Our centralized distribution network in Riyadh allows for rapid fulfillment. Regular items are shipped within 24 hours, with typical delivery times of 1-3 business days depending on your location within Saudi Arabia."
    },
    {
        question: "Do you provide warranty coverage for hydraulic components?",
        answer: "Yes, all our high-performance hydraulic systems and components come with a standard 12-month manufacturer warranty. We also offer extended protection plans for critical infrastructure projects, ensuring minimum downtime."
    },
    {
        question: "Can you source discontinued parts for older machinery models?",
        answer: "Our global sourcing network specializes in identifying 'hard-to-find' and discontinued components for legacy fleets. We work directly with international manufacturers to procure or fabricate custom solutions that meet original specifications."
    },
    {
        question: "Are your engine parts genuine OEM or high-quality aftermarket?",
        answer: "We supply both Genuine OEM and premium ISO-certified aftermarket components. Every part in our inventory undergoes rigorous quality control testing to ensure it meets or exceeds the original performance standards of your equipment."
    }
];

export function FAQSection() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    return (
        <section ref={containerRef} className="py-20 md:py-28 lg:py-32 relative overflow-hidden">
            <div className="container-premium">
                <div className="bg-white/5 rounded-[2rem] border border-white/5 p-8 md:p-16 lg:p-20 relative overflow-hidden">
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                    <div className="relative z-10">
                        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8 }}
                                className="lg:col-span-5"
                            >
                                <span className="micro-label mb-4 block">SUPPORT CENTER</span>
                                <h2 className="heading-lg mb-6">Expert <br /><span className="text-gradient-gold">Technical</span> Support</h2>
                                <p className="text-body-lg text-white/60 mb-10">
                                    Navigating complex industrial components can be challenging. Our technical team is here to provide clarity and ensure your operations remain uninterrupted.
                                </p>

                                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                                        <HelpCircle className="w-7 h-7 text-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2 text-lg">Still Have Questions?</h4>
                                        <p className="text-sm text-white/50 mb-4">Our engineers are available for immediate technical consultation.</p>
                                        <button
                                            onClick={() => window.open('https://wa.me/966570196677?text=I%20have%20a%20technical%20question%20about%20equipment%20parts.', '_blank')}
                                            className="text-gold font-bold text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group/chat"
                                        >
                                            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            Chat with an expert
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8 }}
                                className="lg:col-span-7"
                            >
                                <div className="space-y-4">
                                    {faqs.map((faq, index) => (
                                        <div
                                            key={index}
                                            className={`group rounded-2xl border transition-all duration-300 ${activeIndex === index
                                                ? "bg-white/5 border-gold/30"
                                                : "bg-transparent border-white/5 hover:border-white/20"
                                                }`}
                                        >
                                            <button
                                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                                className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6"
                                            >
                                                <span className={`text-lg font-bold transition-colors ${activeIndex === index ? "text-gold" : "text-white"}`}>
                                                    {faq.question}
                                                </span>
                                                <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${activeIndex === index
                                                    ? "bg-gold border-gold text-navy rotate-180"
                                                    : "border-white/20 text-white"
                                                    }`}>
                                                    {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {activeIndex === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-6 md:px-8 pb-8 pt-0 text-white/60 leading-relaxed border-t border-white/5 mt-2 pt-6">
                                                            {faq.answer}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
