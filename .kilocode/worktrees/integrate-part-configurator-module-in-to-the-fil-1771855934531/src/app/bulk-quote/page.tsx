'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Building2, Truck, Briefcase, Check, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { toast } from 'sonner';

export default function BulkQuotePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        projectType: '',
        items: '',
        quantities: '',
        timeline: '',
        notes: '',
    });

    const volumeDiscounts = [
        { range: '10-49 units', discount: '5%' },
        { range: '50-99 units', discount: '10%' },
        { range: '100-249 units', discount: '15%' },
        { range: '250+ units', discount: '20%' },
    ];

    const b2bBenefits = [
        'Dedicated account manager',
        'Volume pricing discounts',
        'Flexible payment terms',
        'Priority shipping',
        'Project bid support',
        'Technical consultation',
        'Extended warranty options',
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Quote request submitted! Our B2B team will respond within 24 hours.');
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-navy text-white py-12 lg:py-16">
            <div className="container-premium">
                <Breadcrumb className="mb-10">
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Bulk Quote</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.div className="mb-16 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-12 h-12 text-gold" />
                    </div>
                    <h1 className="heading-lg mb-5">B2B Bulk Quote Request</h1>
                    <p className="text-body-lg text-white/60">Get competitive pricing for large orders and project requirements</p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white text-2xl flex items-center gap-3">
                                    <Building2 className="w-6 h-6 text-gold" />Request a Quote
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName" className="text-gray-300">Company Name *</Label>
                                        <Input id="companyName" value={formData.companyName} onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contactPerson" className="text-gray-300">Contact Person *</Label>
                                        <Input id="contactPerson" value={formData.contactPerson} onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-gray-300">Phone Number *</Label>
                                        <Input id="phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="projectType" className="text-gray-300">Project Type</Label>
                                        <Input id="projectType" value={formData.projectType} onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" placeholder="e.g., Government, Construction, Industrial" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="timeline" className="text-gray-300">Required Timeline</Label>
                                        <Input id="timeline" value={formData.timeline} onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" placeholder="e.g., Urgent, 2 weeks, 1 month" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="items" className="text-gray-300">Items & Quantities *</Label>
                                        <Textarea id="items" value={formData.items} onChange={(e) => setFormData(prev => ({ ...prev, items: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" placeholder="List items with quantities (e.g., Excavator EX200 - 2 units, Spare Parts Kit - 50 sets)" required />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="notes" className="text-gray-300">Additional Requirements</Label>
                                        <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" placeholder="Any specific requirements or questions..." />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Button type="submit" disabled={isSubmitting} className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3">
                                            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : 'Submit Quote Request'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader><CardTitle className="text-white flex items-center gap-3"><Truck className="w-5 h-5 text-yellow-500" />Volume Discounts</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                    {volumeDiscounts.map((d, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                                            <span className="text-gray-300">{d.range}</span>
                                            <span className="text-yellow-500 font-bold">{d.discount}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader><CardTitle className="text-white flex items-center gap-3"><Briefcase className="w-5 h-5 text-yellow-500" />B2B Benefits</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    {b2bBenefits.map((b, i) => (
                                        <div key={i} className="flex items-center gap-2 text-gray-300">
                                            <Check className="w-4 h-4 text-yellow-500" />{b}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                <motion.div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-yellow-500/30 rounded-lg p-8 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <Phone className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-white">Prefer to Talk Directly?</h2>
                    <p className="text-gray-300 mb-6">Our B2B team is available Sunday through Thursday, 8AM to 6PM</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => router.push('/contact')} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold">Contact B2B Team</Button>
                        <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10">Call: +966 57 019 6677</Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
