"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus, HelpCircle, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FAQSection() {
    const { t, i18n } = useTranslation();
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const faqIds = ["q1", "q2", "q3", "q4", "q5"];

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
                                <span className="micro-label mb-4 block uppercase">{t('home.faq.label')}</span>
                                <h2 className="heading-lg mb-6">
                                    {t('home.faq.title_prefix')}<br />
                                    <span className="text-gradient-gold">{t('home.faq.title_accent')}</span>
                                    {t('home.faq.title_suffix')}
                                </h2>
                                <p className="text-body-lg text-white/60 mb-10">
                                    {t('home.faq.subtitle')}
                                </p>

                                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                                        <HelpCircle className="w-7 h-7 text-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2 text-lg">{t('home.faq.help_title')}</h4>
                                        <p className="text-sm text-white/50 mb-4">{t('home.faq.help_subtitle')}</p>
                                        <button
                                            onClick={() => window.open('https://wa.me/966570196677?text=I%20have%20a%20technical%20question%20about%20equipment%20parts.', '_blank')}
                                            className="text-gold font-bold text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group/chat"
                                        >
                                            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            {t('home.faq.chat_btn')}
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
                                    {faqIds.map((id, index) => (
                                        <div
                                            key={id}
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
                                                    {t(`home.faq.${id}.q`)}
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
                                                            {t(`home.faq.${id}.a`)}
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
