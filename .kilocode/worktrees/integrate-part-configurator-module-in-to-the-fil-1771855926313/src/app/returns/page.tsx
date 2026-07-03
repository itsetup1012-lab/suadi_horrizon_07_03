'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Package, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const returnProcess = [
    { step: 1, title: 'Submit Request', desc: 'Log into your account and select items to return' },
    { step: 2, title: 'Get Approval', desc: 'Receive return authorization within 24 hours' },
    { step: 3, title: 'Prepare Package', desc: 'Pack items in original packaging with all accessories' },
    { step: 4, title: 'Schedule Pickup', desc: 'We arrange pickup or you can drop off at our store' },
    { step: 5, title: 'Get Refund', desc: 'Receive refund within 5-7 business days' },
];

const eligibleItems = [
    { name: 'Unused machinery parts', desc: 'In original packaging' },
    { name: 'Tools and equipment', desc: 'Unopened and unused' },
    { name: 'Consumables', desc: 'Unopened packaging only' },
];

const ineligibleItems = [
    { name: 'Opened fluids and chemicals', desc: 'For safety reasons' },
    { name: 'Custom-made parts', desc: 'Specially ordered items' },
    { name: 'Electrical components', desc: 'After 7 days of purchase' },
    { name: 'Wearable items', desc: 'Helmets, safety gear' },
];

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-navy text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                <Breadcrumb className="mb-10">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Returns & Refunds</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <RotateCcw className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="heading-lg mb-4 text-center">Returns & <span className="text-gradient-gold">Refunds</span></h1>
                    <p className="text-xl text-white/70 mb-8 text-center">Easy returns within 14 days. No hassle, no questions.</p>

                    {/* Return Policy Highlights */}
                    <div className="grid md:grid-cols-3 gap-4 mb-12">
                        <Card className="glass-light dark:glass-dark">
                            <CardContent className="p-6 text-center">
                                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-bold text-xl mb-2">14 Days</h3>
                                <p className="text-muted-foreground">Return window for most items</p>
                            </CardContent>
                        </Card>
                        <Card className="glass-light dark:glass-dark">
                            <CardContent className="p-6 text-center">
                                <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <RotateCcw className="w-7 h-7 text-green-500" />
                                </div>
                                <h3 className="font-bold text-xl mb-2">Free Returns</h3>
                                <p className="text-muted-foreground">Free pickup for all returns</p>
                            </CardContent>
                        </Card>
                        <Card className="glass-light dark:glass-dark">
                            <CardContent className="p-6 text-center">
                                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-7 h-7 text-blue-500" />
                                </div>
                                <h3 className="font-bold text-xl mb-2">5-7 Days</h3>
                                <p className="text-muted-foreground">Refund processing time</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Return Process */}
                    <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
                    <Card className="glass-light dark:glass-dark mb-12">
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-5 gap-4">
                                {returnProcess.map((item) => (
                                    <div key={item.step} className="text-center">
                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="font-bold text-primary">{item.step}</span>
                                        </div>
                                        <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t">
                                <Button className="w-full">
                                    Start Return Request
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Eligible vs Ineligible */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                Eligible Items
                            </h2>
                            <Card className="glass-light dark:glass-dark">
                                <CardContent className="p-6">
                                    <ul className="space-y-4">
                                        {eligibleItems.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                                Non-Returnable Items
                            </h2>
                            <Card className="glass-light dark:glass-dark">
                                <CardContent className="p-6">
                                    <ul className="space-y-4">
                                        {ineligibleItems.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Refund Methods */}
                    <h2 className="text-2xl font-semibold mb-4">Refund Methods</h2>
                    <Card className="glass-light dark:glass-dark">
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-semibold mb-2">Original Payment</h4>
                                    <p className="text-sm text-muted-foreground">Refunded to your original payment method</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-semibold mb-2">Store Credit</h4>
                                    <p className="text-sm text-muted-foreground">Instant credit to your account</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-semibold mb-2">Exchange</h4>
                                    <p className="text-sm text-muted-foreground">Replace with same or different item</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
