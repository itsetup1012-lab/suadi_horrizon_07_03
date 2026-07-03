'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Mail, Phone, MapPin, UserCheck, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function PrivacyPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-navy text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                <Breadcrumb className="mb-10">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
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
                        <Shield className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="heading-lg mb-4">Privacy <span className="text-gradient-gold">Policy</span></h1>
                    <p className="text-xl text-white/70">
                        Your privacy is important to us. Learn how we protect your information.
                    </p>
                </motion.div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8 text-center">
                    <p className="text-white/60">
                        <span className="text-gold font-semibold">Last Updated:</span> January 2025
                    </p>
                </div>

                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Eye className="w-6 h-6 text-gold" />
                                    Information We Collect
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70">
                                <p>We collect information you provide directly to us:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Personal Information:</strong> Name, email, phone, company details</li>
                                    <li><strong>Transaction Data:</strong> Purchase history, orders, payment information</li>
                                    <li><strong>Communication Data:</strong> Messages through contact forms and email</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Lock className="w-6 h-6 text-gold" />
                                    How We Use Your Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-300">
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Processing and fulfilling your orders</li>
                                    <li>Providing customer support</li>
                                    <li>Sending order confirmations and updates</li>
                                    <li>Improving our products and services</li>
                                    <li>Complying with legal obligations</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <UserCheck className="w-6 h-6 text-gold" />
                                    Your Rights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-300">
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                                    <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                                    <li><strong>Opt-Out:</strong> Opt-out of marketing communications</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Globe className="w-6 h-6 text-gold" />
                                    Data Sharing
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-300">
                                <p>We do not sell your personal information. We may share data with:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Service Providers:</strong> Shipping, payment processors</li>
                                    <li><strong>Business Partners:</strong> Manufacturers for warranty claims</li>
                                    <li><strong>Legal Requirements:</strong> When required by law</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 border border-yellow-500/30 rounded-lg p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">Privacy Officer Contact</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <Mail className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                            <p className="font-semibold text-white">Email</p>
                            <p className="text-gray-300">privacy@saudihorizon.online</p>
                        </div>
                        <div className="text-center">
                            <Phone className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                            <p className="font-semibold text-white">Phone</p>
                            <p className="text-gray-300">+966 57 019 6677</p>
                        </div>
                        <div className="text-center">
                            <MapPin className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                            <p className="font-semibold text-white">Address</p>
                            <p className="text-gray-300">Al-Noor District, Saudi Arabia</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
