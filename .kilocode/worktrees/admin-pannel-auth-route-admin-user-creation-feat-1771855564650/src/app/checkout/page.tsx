'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, CreditCard, Truck, MapPin, FileText, Shield, Lock, ShoppingCart, ArrowRight, Box, ShieldCheck, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getCart, clearCart, CartItem } from '@/api/cart';
import { toast } from 'sonner';
import { FloatingParticles, AnimatedConnector } from "@/components/effects/SceneEffects";
import StripeApplePay from '@/components/cart/StripeApplePay';

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'review';

interface ShippingAddress {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

const steps: { id: CheckoutStep; title: string; icon: React.ReactNode }[] = [
    { id: 'information', title: 'LOGISTICS INFO', icon: <MapPin className="w-5 h-5" /> },
    { id: 'shipping', title: 'DISPATCH MODE', icon: <Truck className="w-5 h-5" /> },
    { id: 'payment', title: 'AUTHORIZATION', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'review', title: 'FINAL REVIEW', icon: <FileText className="w-5 h-5" /> },
];

export default function CheckoutPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Kuwait',
    });

    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);

    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        setMounted(true);
        setOrderId(Math.random().toString(36).substr(2, 9).toUpperCase());
        const items = getCart();
        if (items.length === 0 && mounted) {
            router.push('/products');
            return;
        }
        setCartItems(items);
    }, [router, mounted]);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = shippingMethod === 'express' ? 15 : shippingMethod === 'overnight' ? 25 : 0;
    const discountAmount = subtotal * discount;
    const tax = (subtotal - discountAmount) * 0.15;
    const total = subtotal - discountAmount + shipping + tax;

    const stepIndex = steps.findIndex(s => s.id === currentStep);

    const handleNextStep = () => {
        const nextIndex = stepIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex].id);
        }
    };

    const handlePrevStep = () => {
        const prevIndex = stepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex].id);
        }
    };

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'INDUSTRIAL10') {
            setDiscount(0.1);
            setAppliedPromo('INDUSTRIAL10');
            toast.success('PROMO AUTHORIZED', { description: '10% discount applied to your order' });
        } else {
            toast.error('INVALID CODE', { description: 'The promo code entered is not recognized by the system' });
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        toast.loading('AUTHORIZING TRANSACTION...', { id: 'checkout' });

        await new Promise(resolve => setTimeout(resolve, 2500));

        clearCart();
        toast.success('PROCUREMENT COMPLETE', {
            id: 'checkout',
            description: 'Your order has been logged in our central system'
        });
        router.push('/checkout/success');
        setLoading(false);
    };

    if (!mounted) return null;

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-16 flex-wrap gap-4 overflow-x-auto py-4">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-3 shrink-0 ${index <= stepIndex ? 'text-gold' : 'text-white/20'}`}
                    >
                        <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative ${index < stepIndex
                                ? 'bg-gold text-navy shadow-[0_0_20px_rgba(197,160,89,0.4)]'
                                : index === stepIndex
                                    ? 'bg-gold/10 text-gold border-2 border-gold/50 shadow-[0_0_30px_rgba(197,160,89,0.2)]'
                                    : 'bg-white/5 text-white/20 border border-white/10'
                                }`}
                        >
                            {index < stepIndex ? <Check className="w-6 h-6 stroke-[3px]" /> : step.icon}
                            {index === stepIndex && (
                                <motion.div
                                    layoutId="active-step-glow"
                                    className="absolute -inset-2 bg-gold/10 rounded-[1.5rem] blur-xl"
                                />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Step 0{index + 1}</span>
                            <span className={`text-xs font-black uppercase tracking-[0.1em] ${index === stepIndex ? 'text-white' : ''}`}>
                                {step.title}
                            </span>
                        </div>
                    </motion.div>
                    {index < steps.length - 1 && (
                        <div className={`w-12 h-[2px] rounded-full mx-2 ${index < stepIndex ? 'bg-gold' : 'bg-white/5'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    const renderInformationStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                        <div className="w-1.5 h-6 bg-gold rounded-full" />
                        Procurement Officer
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">First Name</Label>
                            <Input
                                id="firstName"
                                value={shippingAddress.firstName}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                                placeholder="e.g. Abdullah"
                                className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-gold/50 focus:ring-0 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Last Name</Label>
                            <Input
                                id="lastName"
                                value={shippingAddress.lastName}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                                placeholder="e.g. Al-Fahad"
                                className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-gold/50 focus:ring-0 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Corporate Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={shippingAddress.email}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                            placeholder="officer@corporate-domain.com"
                            className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-gold/50 focus:ring-0 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                        <div className="w-1.5 h-6 bg-gold rounded-full" />
                        Logistics Destination
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Facility Address</Label>
                        <Input
                            id="address"
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                            placeholder="Unit/Block Number, Street Name"
                            className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-gold/50 focus:ring-0 transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">City/Area</Label>
                            <Input
                                id="city"
                                value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                placeholder="Kuwait City"
                                className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-gold/50 focus:ring-0 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Contact Phone</Label>
                            <Input
                                id="phone"
                                value={shippingAddress.phone}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                placeholder="+965 XXXX XXXX"
                                className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-gold/50 focus:ring-0 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderShippingStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                <div className="w-1.5 h-6 bg-gold rounded-full" />
                Select Dispatch Logistics
            </h3>
            <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { id: 'standard', title: 'Standard Freight', time: '5-7 working days', price: 0, icon: Box },
                    { id: 'express', title: 'Express Cargo', time: '2-3 working days', price: 15, icon: Truck },
                    { id: 'overnight', title: 'Critical Overnight', time: 'Next Morning', price: 25, icon: Zap },
                ].map((method) => (
                    <div
                        key={method.id}
                        onClick={() => setShippingMethod(method.id)}
                        className={`card-premium p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 relative group flex flex-col items-center text-center ${shippingMethod === method.id ? 'border-gold bg-gold/10' : 'border-white/5 hover:border-gold/30'}`}
                    >
                        <div className={`p-4 rounded-2xl mb-4 transition-colors ${shippingMethod === method.id ? 'bg-gold text-navy' : 'bg-white/5 text-white/20'}`}>
                            <method.icon className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-black text-white mb-2">{method.title}</h4>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">{method.time}</p>
                        <div className="mt-auto">
                            <span className={`text-xl font-black ${method.price === 0 ? 'text-emerald-500' : 'text-gold'}`}>
                                {method.price === 0 ? 'PROTOCOL COMP' : `KWD ${method.price.toFixed(2)}`}
                            </span>
                        </div>
                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                    </div>
                ))}
            </RadioGroup>
        </motion.div>
    );

    const renderPaymentStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                <div className="w-1.5 h-6 bg-gold rounded-full" />
                Transaction Authorization
            </h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                {[
                    { id: 'card', title: 'Corporate Credit/Debit', desc: 'Secure processing via VISA/MasterCard/KNET', icon: CreditCard },
                    { id: 'knet', title: 'KNET Gateway', desc: 'Direct bank transfer authorization', icon: ShieldCheck },
                ].map((method) => (
                    <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`card-premium p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 flex items-center gap-6 ${paymentMethod === method.id ? 'border-gold bg-gold/10' : 'border-white/5 hover:border-gold/30'}`}
                    >
                        <div className={`p-4 rounded-xl ${paymentMethod === method.id ? 'bg-gold text-navy' : 'bg-white/5 text-white/20'}`}>
                            <method.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-white mb-1 uppercase tracking-wider">{method.title}</h4>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{method.desc}</p>
                        </div>
                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                        {paymentMethod === method.id && <Check className="w-6 h-6 text-gold" />}
                    </div>
                ))}
            </RadioGroup>

            {/* Apple Pay / Express Checkout Section */}
            <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px bg-white/5 flex-1" />
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">SECURE EXPRESS AUTHORIZATION</span>
                    <div className="h-px bg-white/5 flex-1" />
                </div>
                <div className="card-premium p-8 rounded-3xl border-gold/20 bg-gold/5">
                    <StripeApplePay cartItems={cartItems} />
                    <p className="text-[9px] text-center text-white/20 uppercase tracking-widest mt-4 font-bold">
                        ONE-CLICK CORPORATE CLEARANCE ENABLED
                    </p>
                </div>
            </div>

            {/* Security Box */}
            <div className="mt-10 p-8 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-8">
                <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20">
                    <Lock className="w-8 h-8 text-gold" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white mb-1 uppercase tracking-widest text-gradient-gold">Encrypted Authorization</h4>
                    <p className="text-[10px] leading-relaxed text-white/30 uppercase tracking-[0.15em] font-bold">
                        Phase-3 SSL encryption active. Your corporate payment credentials are never stored in our local technical databases.
                    </p>
                </div>
            </div>
        </motion.div>
    );

    const renderReviewStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="card-premium p-8 rounded-[2rem] border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-gold/5 group-hover:text-gold/10 transition-colors">
                            <MapPin className="w-24 h-24" />
                        </div>
                        <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-6">Logistics Destination</h4>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                            <p className="text-sm text-white/60 font-medium">{shippingAddress.address}</p>
                            <p className="text-sm text-white/60 font-medium">{shippingAddress.city}, {shippingAddress.country}</p>
                            <p className="text-sm text-white/60 font-medium pt-4">{shippingAddress.email}</p>
                        </div>
                        <Button variant="link" size="sm" onClick={() => setCurrentStep('information')} className="mt-6 p-0 text-gold hover:text-white uppercase text-[10px] font-black tracking-widest">Modify Details</Button>
                    </div>

                    <div className="card-premium p-8 rounded-[2rem] border-white/5 flex items-center justify-between">
                        <div>
                            <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-2">Dispatch Protocol</h4>
                            <p className="text-lg font-black text-white capitalize">{shippingMethod} Logistics</p>
                        </div>
                        <Truck className="w-10 h-10 text-white/10" />
                    </div>

                    <div className="card-premium p-8 rounded-[2rem] border-white/5 flex items-center justify-between">
                        <div>
                            <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-2">Payment Method</h4>
                            <p className="text-lg font-black text-white capitalize">{paymentMethod === 'card' ? 'Corporate Card' : 'KNET Gateway'}</p>
                        </div>
                        <CreditCard className="w-10 h-10 text-white/10" />
                    </div>
                </div>

                <div>
                    <div className="card-premium p-8 md:p-10 rounded-[2.5rem] bg-navy/60 border-gold/10">
                        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4" style={{ fontFamily: 'var(--font-display)' }}>
                            <div className="w-2 h-8 bg-gold rounded-full" />
                            Pre-Procurement Review
                        </h3>

                        <div className="space-y-6 max-h-60 overflow-y-auto pr-4 mb-8 custom-scrollbar">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-navy border border-white/10 rounded-lg overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-wider line-clamp-1">{item.name}</p>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-gold">KWD {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <Separator className="bg-white/5 mb-8" />

                        <div className="space-y-4 text-xs font-black uppercase tracking-widest mb-10">
                            <div className="flex justify-between items-center">
                                <span className="text-white/40">Subtotal</span>
                                <span className="text-white">KWD {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/40">Logistics Fee</span>
                                <span className="text-white">KWD {shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/40">VAT (15%)</span>
                                <span className="text-white">KWD {tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                <span className="text-gold tracking-[0.4em] mb-1">TOTAL AUTHORIZED</span>
                                <span className="text-4xl text-gradient-gold" style={{ fontFamily: 'var(--font-display)' }}>
                                    KWD {total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-18 text-xl font-black uppercase tracking-[0.2em] rounded-2xl bg-gold text-navy shadow-[0_15px_40px_rgba(197,160,89,0.3)] group relative overflow-hidden"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-shimmer" />
                            {loading ? 'AUTHORIZING...' : 'PLACE PROCUREMENT ORDER'}
                            {!loading && <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="text-white pb-24 relative overflow-hidden min-h-screen">
            {/* Ambient Effects */}
            <FloatingParticles />

            <div className="container-premium relative z-10 pt-8">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => router.push('/')} className="hover:text-gold cursor-pointer transition-colors text-slate-400 uppercase text-[10px] tracking-[0.2em] font-bold">HOME</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-slate-600" />
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => router.push('/cart')} className="hover:text-gold cursor-pointer transition-colors text-slate-400 uppercase text-[10px] tracking-[0.2em] font-bold">BASKET</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-slate-600" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-gold uppercase text-[10px] tracking-[0.2em] font-bold underline underline-offset-4 decoration-gold/30">CHECKOUT PROTOCOL</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </motion.div>

                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-xl"
                    >
                        <span className="micro-label mb-4 block underline decoration-gold/50 underline-offset-8">PHASE 2 / AUTHORIZATION</span>
                        <h1 className="text-5xl font-black mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                            Procurement <span className="text-gradient-gold">Authorization.</span>
                        </h1>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                            Order ID: <span className="text-gold truncate max-w-[150px] inline-block align-bottom">{orderId || 'GENERATING...'}</span> | Security: <span className="text-emerald-500">LEVEL 4 ACTIVE</span>
                        </p>
                    </motion.div>
                </div>

                <AnimatedConnector />

                {renderStepIndicator()}

                <div className="mt-12">
                    <AnimatePresence mode="wait">
                        {currentStep === 'information' && renderInformationStep()}
                        {currentStep === 'shipping' && renderShippingStep()}
                        {currentStep === 'payment' && renderPaymentStep()}
                        {currentStep === 'review' && renderReviewStep()}
                    </AnimatePresence>
                </div>

                <div className="flex justify-between items-center mt-16 pt-8 border-t border-white/5">
                    <Button
                        variant="ghost"
                        onClick={handlePrevStep}
                        disabled={stepIndex === 0}
                        className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] disabled:opacity-0 transition-all"
                    >
                        Return to Previous Phase
                    </Button>

                    {currentStep !== 'review' && (
                        <Button
                            className="h-16 px-12 rounded-2xl bg-white/5 border border-white/10 text-white hover:border-gold/50 hover:bg-gold hover:text-navy font-black uppercase tracking-[0.2em] transition-all group"
                            onClick={handleNextStep}
                        >
                            Logistics Continuity
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    )}
                </div>

                {/* Footer Utility */}
                <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 py-10 border-t border-white/5">
                    <div className="flex items-center gap-8 text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">
                        <span className="flex items-center gap-2"><Shield size={10} className="text-gold/40" /> 256-bit AES Encryption</span>
                        <span className="flex items-center gap-2"><Check size={10} className="text-gold/40" /> ISO Certified Protocol</span>
                        <span className="flex items-center gap-2"><Zap size={10} className="text-gold/40" /> Latency Optimized</span>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-6 bg-white/5 rounded-sm border border-white/10" />
                        <div className="w-10 h-6 bg-white/5 rounded-sm border border-white/10" />
                        <div className="w-10 h-6 bg-white/5 rounded-sm border border-white/10" />
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
        </div>
    );
}

