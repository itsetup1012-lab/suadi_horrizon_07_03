'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail, MapPin, Clock, ShoppingBag, ArrowRight, ShieldCheck, Zap, Box, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FloatingParticles, AnimatedConnector } from "@/components/effects/SceneEffects";

export default function CheckoutSuccessPage() {
    const router = useRouter();

    const [orderNumber, setOrderNumber] = React.useState('');

    React.useEffect(() => {
        setOrderNumber(`ORD-${Date.now().toString().slice(-8).toUpperCase()}`);
    }, []);

    return (
        <div className="min-h-screen bg-navy text-white py-24 relative overflow-hidden flex flex-col items-center">
            {/* Ambient Effects */}
            <FloatingParticles />

            <div className="w-full max-w-4xl px-6 relative z-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className="text-center mb-16"
                >
                    <div className="relative inline-block mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-32 h-32 bg-gold/10 rounded-[2.5rem] flex items-center justify-center relative z-10 border border-gold/20 shadow-[0_0_50px_rgba(197,160,89,0.2)]"
                        >
                            <CheckCircle className="w-16 h-16 text-gold" />
                        </motion.div>
                        <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
                    </div>

                    <span className="micro-label mb-4 block">PAYMENT SUCCESSFUL</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                        Order <span className="text-gradient-gold">Confirmed.</span>
                    </h1>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
                        Your order has been placed successfully. We'll send a confirmation to your email with tracking details.
                    </p>
                </motion.div>

                <AnimatedConnector />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 space-y-8"
                >
                    <Card className="card-premium rounded-[2.5rem] border-white/5 bg-navy/40 backdrop-blur-xl overflow-hidden">
                        <CardContent className="p-8 md:p-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">ORDER REFERENCE</span>
                                <div className="px-6 py-3 bg-gold/10 border border-gold/20 rounded-xl">
                                    <span className="font-mono text-xl font-black text-gold tracking-wider">{orderNumber}</span>
                                </div>
                            </div>

                            <Separator className="mb-8 bg-white/5" />

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-gold/30 transition-colors">
                                            <Mail className="w-5 h-5 text-gold/60" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Confirmation Email Sent</p>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest leading-relaxed font-bold">A confirmation email has been sent to your email address.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-gold/30 transition-colors">
                                            <ShieldCheck className="w-5 h-5 text-gold/60" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Quality Assured</p>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest leading-relaxed font-bold">All items are inspected for quality before shipping.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-gold/30 transition-colors">
                                            <Truck className="w-5 h-5 text-gold/60" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Shipping Soon</p>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest leading-relaxed font-bold">Your order will be shipped within 24-48 business hours.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-gold/30 transition-colors">
                                            <MapPin className="w-5 h-5 text-gold/60" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Order Tracking</p>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest leading-relaxed font-bold">You'll receive a tracking link once your order ships.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-premium rounded-[2.5rem] border-white/5 bg-navy/40 backdrop-blur-xl">
                        <CardContent className="p-8 md:p-10">
                            <h2 className="text-2xl font-black mb-10 text-white tracking-tight flex items-center gap-4" style={{ fontFamily: 'var(--font-display)' }}>
                                <div className="w-2 h-8 bg-gold rounded-full" />
                                Delivery Steps
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {[
                                    { step: '01', title: 'Order Confirmed', icon: Box, desc: 'Your order is confirmed and payment has been received.' },
                                    { step: '02', title: 'Packed & Ready', icon: Zap, desc: 'Items are carefully packed with protective packaging.' },
                                    { step: '03', title: 'Shipped', icon: Truck, desc: 'Your order is on its way to the delivery address.' },
                                ].map((phase, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-2xl font-black text-white/10 group-hover:text-gold/20 transition-colors">{phase.step}</span>
                                            <div className="h-px flex-1 bg-white/5" />
                                            <phase.icon className="w-5 h-5 text-gold/40" />
                                        </div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">{phase.title}</p>
                                        <p className="text-[9px] text-white/20 uppercase tracking-[0.15em] leading-relaxed font-bold">{phase.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                        <Button
                            variant="outline"
                            className="h-18 rounded-2xl border-white/10 text-white/40 hover:text-gold hover:border-gold/30 hover:bg-white/5 font-black uppercase tracking-[0.3em] text-[10px]"
                            onClick={() => router.push('/products')}
                        >
                            <ShoppingBag className="w-4 h-4 mr-3" />
                            Return to Products
                        </Button>
                        <Button
                            className="h-18 rounded-2xl bg-gold text-navy font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_15px_40px_rgba(197,160,89,0.2)] group"
                            onClick={() => router.push('/')}
                        >
                            Back to Home
                            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Need Help With Your Order?</p>
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/contact')}
                            className="text-gold hover:text-white uppercase text-[10px] font-black tracking-widest p-0 underline-offset-8 decoration-gold/30 underline h-auto"
                        >
                            Contact Customer Support
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
        </div>
    );
}

