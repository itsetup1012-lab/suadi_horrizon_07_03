'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Percent, Building, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function TaxInfoPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-navy text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Tax Information</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Hero Section */}
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Percent className="w-10 h-10 text-yellow-500" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-white">Saudi VAT & Tax Information</h1>
                    <p className="text-xl text-gray-300">
                        Information about VAT, tax invoices, and ZATCA compliance
                    </p>
                </motion.div>

                {/* VAT Information */}
                <div className="space-y-8">
                    {/* Section 1: VAT Rate */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Percent className="w-6 h-6 text-gold" />
                                    VAT Rate (15%)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-white/70">
                                <p>
                                    The Kingdom of Saudi Arabia applies a Value Added Tax (VAT) rate of <strong className="text-gold">15%</strong> on all taxable goods and services, as mandated by ZATCA (Zakat, Tax and Customs Authority).
                                </p>
                                <p><strong>What this means for you:</strong></p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>All prices displayed on our website include 15% VAT</li>
                                    <li>Tax invoices will clearly show the VAT amount</li>
                                    <li>Input tax credit is available for registered businesses</li>
                                    <li>Exports to countries outside GCC may be zero-rated</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 2: Tax Invoice Requirements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <FileText className="w-6 h-6 text-gold" />
                                    Tax Invoice Requirements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-300">
                                <p>All tax invoices issued by Saudi Horizon comply with ZATCA requirements and include:</p>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-gray-700/50 rounded-lg p-4">
                                        <h4 className="font-semibold text-white mb-2">Invoice Header</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Supplier name and VAT registration number</li>
                                            <li>Invoice number and date</li>
                                            <li>Customer information (if applicable)</li>
                                            <li>Sequential invoice numbering</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-700/50 rounded-lg p-4">
                                        <h4 className="font-semibold text-white mb-2">Invoice Details</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            <li>Description of goods/services</li>
                                            <li>Unit price and quantity</li>
                                            <li>Discounts applied</li>
                                            <li>VAT amount and total</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 3: ZATCA Compliance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Building className="w-6 h-6 text-gold" />
                                    ZATCA Compliance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-300">
                                <p>
                                    Saudi Horizon is fully compliant with ZATCA (Zakat, Tax and Customs Authority) regulations for e-invoicing. Our invoicing system meets all requirements including:
                                </p>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                            <span>Electronic invoice generation and storage</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                            <span>Unique invoice identification number</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                            <span>QR code generation on all invoices</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                            <span>Digital signature for authenticity</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                            <span>Integration with ZATCA e-invoicing portal</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                            <span>Secure data retention for 6 years</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 4: VAT Registration */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <AlertCircle className="w-6 h-6 text-gold" />
                                    VAT Registration Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-300">
                                <p><strong>Our VAT Registration Number:</strong></p>
                                <p className="text-2xl font-mono text-gold">310XXXXXXXXXX</p>

                                <p className="mt-4"><strong>For Business Customers:</strong></p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>If your company is VAT registered, please provide your VAT number at checkout</li>
                                    <li>Tax invoices will include your company details for VAT reclaim purposes</li>
                                    <li>Business-to-business transactions may be handled under reverse charge mechanism</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 5: Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Questions About VAT?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-300">
                                <p>If you have any questions about VAT, tax invoices, or need assistance with your tax-related inquiries, please contact our finance team.</p>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <Button
                                        onClick={() => router.push('/contact')}
                                        className="btn-primary"
                                    >
                                        Contact Us
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Disclaimer */}
                <motion.div
                    className="mt-8 bg-white/5 border border-white/10 rounded-lg p-4 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p className="text-gray-400 text-sm">
                        The information provided above is for general guidance only. For specific tax advice,
                        please consult with a qualified tax professional or contact ZATCA directly.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
