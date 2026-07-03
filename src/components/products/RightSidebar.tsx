'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Truck, ShieldCheck, Clock, FileText, ChevronRight, Phone, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export function RightSidebar() {
    const router = useRouter();
    return (
        <div className="space-y-10">
            {/* Technical Specialist Support */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="p-6 rounded-2xl bg-gold/5 border border-gold/10 relative group overflow-hidden">
                    <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                        <MessageCircle className="w-40 h-40 text-gold rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-gold" />
                            </div>
                            <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] font-mono">
                                Engineering Support
                            </span>
                        </div>

                        <h3 className="text-sm font-black text-white mb-2 tracking-tight uppercase">Need Technical Assistance?</h3>
                        <p className="text-[10px] text-white/50 leading-relaxed font-bold uppercase tracking-widest mb-6">
                            identifying complex parts can be difficult. Our engineers are online to assist you instantly.
                        </p>

                        <Button
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl"
                            onClick={() => window.open('https://wa.me/966570196677', '_blank')}
                        >
                            Connect via WhatsApp
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Bulk Quotation Card - Relocated from top banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative group overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                        <Quote className="w-24 h-24 text-white -rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white/30" />
                            </div>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] font-mono">
                                Bulk Inquiries
                            </span>
                        </div>

                        <h3 className="text-sm font-black text-white mb-2 tracking-tight uppercase underline decoration-gold/50 underline-offset-4">Bulk Corporate Quote?</h3>
                        <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-widest mb-6">
                            PRIORITY PRICING FOR FLEET-WIDE MAINTENANCE AND LARGE-SCALE GCC PROJECTS.
                        </p>

                        <Button
                            variant="outline"
                            className="w-full border-white/10 hover:border-gold/50 hover:bg-gold/5 text-white/60 hover:text-gold font-black uppercase text-[10px] tracking-widest h-12 rounded-xl transition-all"
                            onClick={() => router.push('/bulk-quote')}
                        >
                            Request Pricing
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Quick Logistics Summary */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-3 mb-2">
                    <Truck className="w-4 h-4 text-white/40" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] font-mono">
                        Global Logistics
                    </span>
                </div>
                <div className="space-y-3">
                    {[
                        { region: 'Central (Riyadh)', time: 'NEXT DAY' },
                        { region: 'Western (Jeddah)', time: '24-48 HR' },
                        { region: 'Eastern (Dammam)', time: '24 HR' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                            <span className="text-[10px] font-bold text-white/60 tracking-wider">
                                {item.region}
                            </span>
                            <span className="text-[10px] font-black text-gold font-mono">
                                {item.time}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Trust Matrix */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 gap-4 pt-10"
            >
                {[
                    { icon: ShieldCheck, title: 'OEM Genuine', desc: '100% Certified' },
                    { icon: Clock, title: 'Rapid Transit', desc: 'GPS Monitored' }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-gold/30 transition-colors">
                            <item.icon className="w-4 h-4 text-white/40 group-hover:text-gold transition-colors" />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">{item.title}</h5>
                            <p className="text-[8px] text-white/40 uppercase tracking-widest font-black font-mono">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
