'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wrench, Calendar, Shield, Clock, CheckCircle, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const maintenancePlans = [
    {
        name: 'Basic Plan',
        price: 'From SAR 2,500/month',
        features: ['Quarterly inspections', 'Filter replacements', 'Fluid checks', 'Priority support'],
        description: 'Essential maintenance for light-duty equipment',
    },
    {
        name: 'Standard Plan',
        price: 'From SAR 5,000/month',
        features: ['Monthly inspections', 'All Basic features', 'Wear part replacement', 'Emergency service', 'Maintenance reports'],
        description: 'Comprehensive coverage for medium-duty fleet',
    },
    {
        name: 'Premium Plan',
        price: 'From SAR 10,000/month',
        features: ['Bi-weekly inspections', 'All Standard features', 'Full parts inventory', '24/7 on-site support', 'Equipment manager training'],
        description: 'Complete solution for heavy-duty fleet operations',
    },
];

const maintenanceTips = [
    {
        title: 'Daily Checks',
        items: [
            'Check engine oil level before starting',
            'Inspect hydraulic fluid levels',
            'Verify coolant levels and condition',
            'Check tire pressure and condition',
            'Inspect belts and hoses for wear',
        ],
    },
    {
        title: 'Weekly Maintenance',
        items: [
            'Clean air filters if dusty',
            'Check battery terminals and connections',
            'Inspect tracks/undercarriage tension',
            'Lubricate pivot points',
            'Check lights and indicators',
        ],
    },
    {
        title: 'Monthly Tasks',
        items: [
            'Change engine oil and filter',
            'Inspect hydraulic hoses',
            'Check transmission fluid',
            'Grease all fittings',
            'Inspect bucket and attachments',
        ],
    },
    {
        title: 'Seasonal Service',
        items: [
            'Complete fluid system flush',
            'Coolant system service',
            'Fuel system cleaning',
            'Track replacement or rotation',
            'Major component inspection',
        ],
    },
];

export default function MaintenancePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-navy text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Maintenance Services</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Wrench className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="heading-lg mb-4">Preventive Maintenance <span className="text-gradient-gold">Services</span></h1>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        Extend the life of your equipment with our comprehensive maintenance programs.
                        Scheduled service contracts available throughout Saudi Arabia.
                    </p>
                </motion.div>

                {/* Benefits */}
                <motion.div
                    className="grid md:grid-cols-4 gap-6 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <Clock className="w-12 h-12 text-gold mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Reduced Downtime</h3>
                            <p className="text-white/60">Preventive care keeps your equipment running</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <Shield className="w-12 h-12 text-gold mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Extended Lifespan</h3>
                            <p className="text-white/60">Regular maintenance extends equipment life by 30%</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <Calendar className="w-12 h-12 text-gold mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Scheduled Service</h3>
                            <p className="text-white/60">Planned maintenance fits your schedule</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <Wrench className="w-12 h-12 text-gold mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Certified Techs</h3>
                            <p className="text-white/60">Factory-trained service technicians</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Maintenance Plans */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h2 className="heading-md mb-6">Service Contract <span className="text-gradient-gold">Plans</span></h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {maintenancePlans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className={`bg-white/5 border-white/10 ${index === 1 ? 'border-gold/50' : ''} hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300 h-full`}>
                                    <CardHeader>
                                        <CardTitle className="text-white">{plan.name}</CardTitle>
                                        <p className="text-2xl font-bold text-gold">{plan.price}</p>
                                        <CardDescription className="text-white/60">{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ul className="space-y-2">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            className="w-full btn-primary"
                                            onClick={() => router.push('/contact')}
                                        >
                                            Get Quote
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Maintenance Tips */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h2 className="heading-md mb-6">Maintenance Schedule <span className="text-gradient-gold">Guide</span></h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {maintenanceTips.map((section, index) => (
                            <Card key={section.title} className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gold" />
                                        {section.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {section.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Service Areas */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-white">Service Coverage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/60 mb-4">
                                Our mobile service teams cover all major cities and industrial areas in Saudi Arabia:
                            </p>
                            <div className="grid md:grid-cols-4 gap-4">
                                {['Riyadh', 'Jeddah', 'Dammam', 'Yanbu', 'Rabigh', 'Jubail', 'Al Khobar', 'Mecca'].map((city) => (
                                    <div key={city} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:border-gold/30 transition-all">
                                        <p className="font-semibold text-white">{city}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="bg-gradient-to-r from-gold/20 to-transparent border border-gold/30 rounded-2xl p-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="heading-md mb-4">Need Emergency <span className="text-gradient-gold">Service?</span></h2>
                    <p className="text-white/60 mb-6">
                        Our 24/7 emergency response team is available for critical repairs.
                    </p>
                    <Button
                        onClick={() => router.push('/contact')}
                        className="btn-primary"
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Service Team
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
