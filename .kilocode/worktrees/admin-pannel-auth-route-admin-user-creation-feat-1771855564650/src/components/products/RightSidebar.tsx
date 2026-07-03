'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Truck, ShieldCheck, Clock, FileText, ChevronRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function RightSidebar() {
    return (
        <div className="space-y-8 h-full sticky top-32">
            {/* Technical Specialist Support */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="glass-premium border-gold/10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageCircle className="w-16 h-16 text-gold" />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Expert Advice</h4>
                                <p className="text-[10px] text-gold/60 font-black uppercase tracking-widest">Engineering Staff</p>
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-3">Can't identify your component?</h3>
                        <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-wider font-bold mb-6">
                            Send a photo of your part nameplate or SKU. Our technical engineers respond within 15 minutes.
                        </p>
                        <Button
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl group"
                            onClick={() => window.open('https://wa.me/966570196677', '_blank')}
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Direct Engineering Link
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Logistics Summary */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card-premium p-6 rounded-[2rem] bg-navy/40 backdrop-blur-md border-white/5"
            >
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                    <Truck className="w-3 h-3 text-gold" />
                    Express Logistics
                </h4>
                <div className="space-y-4">
                    {[
                        { region: 'Central (Riyadh)', time: 'Next Day' },
                        { region: 'Western (Jeddah)', time: '24-48 HR' },
                        { region: 'Eastern (Dammam)', time: '24 HR' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-white/40 uppercase tracking-widest">{item.region}</span>
                            <span className="text-gold tracking-widest">{item.time}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Trust Matrix */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
            >
                {[
                    { icon: ShieldCheck, title: 'OEM Verified', desc: '100% Genuine Certification' },
                    { icon: Clock, title: 'Rapid Transit', desc: 'Real-time GPS Monitoring' },
                    { icon: FileText, title: 'Bulk Discounts', desc: 'Corporate Fleet Pricing' }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-gold/30 transition-colors">
                            <item.icon className="w-4 h-4 text-gold/40 group-hover:text-gold transition-colors" />
                        </div>
                        <div>
                            <h5 className="text-[9px] font-black text-white uppercase tracking-widest">{item.title}</h5>
                            <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Need Help CTA */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="p-8 rounded-[2.5rem] bg-gold/5 border border-dashed border-gold/20 text-center"
            >
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-4">Urgent Requirement?</p>
                <a
                    href="tel:+966570196677"
                    className="text-xl font-black text-white hover:text-gold transition-colors flex items-center justify-center gap-3 mb-2"
                >
                    <Phone className="w-5 h-5 text-gold" />
                    966 570 196 677
                </a>
                <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold font-mono">24/7 TECHNICAL PROCUREMENT</p>
            </motion.div>
        </div>
    );
}
