'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { FloatingParticles, AnimatedConnector } from "@/components/effects/SceneEffects";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContactPage() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: 'general',
        message: '',
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, subject: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Send via WhatsApp
        const message = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCompany: ${formData.company}\nSubject: ${formData.subject}\n\nMessage: ${formData.message}`
        );
        window.open(`https://wa.me/966570196677?text=${message}`, '_blank');

        toast.success('Inquiry Forwarded', {
            description: 'Your message has been sent to our sales team via WhatsApp',
        });

        setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            subject: 'general',
            message: '',
        });
    };

    const contactMethods = [
        {
            icon: Phone,
            title: "Direct Line",
            value: "+966 57 019 6677",
            sub: "WhatsApp Available 24/7",
            href: "tel:+966570196677"
        },
        {
            icon: Mail,
            title: "Email Support",
            value: "salehma@saudihorizon.online",
            sub: "Official Inquiries",
            href: "mailto:salehma@saudihorizon.online"
        },
        {
            icon: MapPin,
            title: "Headquarters",
            value: "Al-Noor Mall, Riyadh",
            sub: "Kingdom of Saudi Arabia",
            href: "#"
        }
    ];

    return (
        <div className="text-white pb-24 relative overflow-hidden" ref={containerRef}>
            {/* Ambient Background */}
            <FloatingParticles />

            <div className="container-premium relative z-10">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => router.push('/')} className="hover:text-gold cursor-pointer transition-colors text-slate-400 uppercase text-[10px] tracking-[0.2em] font-bold">HOME</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-slate-600" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-gold uppercase text-[10px] tracking-[0.2em] font-bold underline underline-offset-4 decoration-gold/30">CONTACT</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </motion.div>

                <div className="mb-24 text-center max-w-4xl mx-auto pt-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="micro-label mb-6 block">GET IN TOUCH</span>
                        <h1 className="text-6xl md:text-7xl font-black mb-10 leading-[0.9] tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                            Let's solve your <br />
                            <span className="text-gradient-gold">industrial needs.</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-white/50 leading-relaxed"
                    >
                        Our engineering and sales team is ready to assist with technical specifications,
                        volume pricing, and logistics for your heavy equipment fleet.
                    </motion.p>
                </div>

                <AnimatedConnector />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-32 pt-10">
                    {/* Sidebar Information */}
                    <div className="lg:col-span-4 space-y-6">
                        {contactMethods.map((method, idx) => (
                            <motion.a
                                key={idx}
                                href={method.href}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                className="card-premium group block p-8 border-white/5 bg-navy/40 backdrop-blur-sm relative overflow-hidden"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 border border-gold/10 group-hover:bg-gold group-hover:text-navy transition-all duration-500">
                                    <method.icon className="w-6 h-6 text-gold group-hover:text-navy" />
                                </div>
                                <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">{method.title}</h3>
                                <p className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-gold transition-colors">{method.value}</p>
                                <p className="text-sm text-white/30 uppercase tracking-widest">{method.sub}</p>
                            </motion.a>
                        ))}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-10 rounded-[2rem] bg-gradient-to-br from-gold/10 to-navy-light/50 border border-gold/10 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Clock className="w-24 h-24 text-gold" />
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                                    <Clock className="w-5 h-5 text-gold" />
                                </div>
                                <h3 className="font-black text-lg tracking-tight">Operating Hours</h3>
                            </div>
                            <p className="text-base text-white/50 leading-relaxed font-medium">
                                Our sales support is active from 8:00 AM to 6:00 PM (AST).
                                Emergency parts support via <span className="text-gold">WhatsApp</span> is available 24/7.
                            </p>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="card-premium rounded-[3rem] p-8 md:p-12 lg:p-16 border border-white/10 bg-navy/60 backdrop-blur-md relative overflow-hidden"
                        >
                            {/* Decorative background effects */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

                            <div className="relative z-10">
                                <span className="micro-label mb-6 block">ENQUIRY FORM</span>
                                <h2 className="text-4xl font-black mb-10 tracking-tighter flex items-center gap-4 py-2">
                                    <Send className="w-8 h-8 text-gold" />
                                    Submit an <span className="text-gradient-gold">Inquiry</span>
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="name" className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold ml-1">Full Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-gold/50 focus:ring-0 transition-all placeholder:text-white/10"
                                                placeholder="Engineer Name"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="email" className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold ml-1">Email Address *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-gold/50 focus:ring-0 transition-all placeholder:text-white/10"
                                                placeholder="email@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="phone" className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold ml-1">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-gold/50 focus:ring-0 transition-all placeholder:text-white/10"
                                                placeholder="+966"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="company" className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold ml-1">Company Capacity</Label>
                                            <Input
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-gold/50 focus:ring-0 transition-all placeholder:text-white/10"
                                                placeholder="Construction / Logistics / Mining"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="subject" className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold ml-1">Inquiry Type *</Label>
                                        <Select value={formData.subject} onValueChange={handleSelectChange}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:ring-0 focus:border-gold/50">
                                                <SelectValue placeholder="Select interest" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-navy border-white/10 text-white">
                                                <SelectItem value="general">General Corporate Inquiry</SelectItem>
                                                <SelectItem value="quote">Request Bulk Quote</SelectItem>
                                                <SelectItem value="parts">Specific Parts Search</SelectItem>
                                                <SelectItem value="support">Technical OEM Support</SelectItem>
                                                <SelectItem value="partnership">Fleet Partnership</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="message" className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold ml-1">Technical Requirements *</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            className="bg-white/5 border-white/10 text-white min-h-[160px] rounded-xl focus:border-gold/50 focus:ring-0 transition-all placeholder:text-white/10 resize-none p-6"
                                            placeholder="Describe the parts or services required..."
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="btn-primary w-full h-16 text-lg font-bold group"
                                        >
                                            <MessageCircle className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                                            Submit via Industrial Support
                                            <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </Button>
                                    </div>

                                    <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold pt-6 border-t border-white/5">
                                        CONFIDENTIAL SUBMISSION PROTOCOL ACTIVE
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Section Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
        </div>
    );
}

