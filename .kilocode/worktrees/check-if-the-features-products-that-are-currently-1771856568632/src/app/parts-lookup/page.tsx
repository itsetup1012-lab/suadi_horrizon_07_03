'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, FileText, Phone, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const machineCategories = ['Excavator', 'Wheel Loader', 'Bulldozer', 'Crane', 'Forklift', 'Generator', 'Concrete Equipment', 'Road Equipment'];
const popularSearches = ['EX200', 'PC200', 'D6T', 'S280', 'G350', 'Air Filter', 'Hydraulic Pump', 'Bucket Tooth'];

export default function PartsLookupPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('machine');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<{ found: boolean; message: string } | null>(null);
    const [searchForm, setSearchForm] = useState({
        machineModel: '',
        machineSerial: '',
        vinNumber: '',
        partNumber: '',
        engineSerial: '',
    });

    const handleSearch = async (type: string) => {
        setIsSearching(true);
        setSearchResult(null);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSearchResult({ found: true, message: `Part lookup results for ${type} search would appear here.` });
        setIsSearching(false);
    };

    const handleQuickSearch = (term: string) => {
        setSearchForm(prev => ({ ...prev, machineModel: term }));
        setActiveTab('machine');
        handleSearch(term);
    };

    return (
        <div className="min-h-screen bg-navy text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Parts Lookup</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="heading-lg mb-4">Parts <span className="text-gradient-gold">Lookup</span></h1>
                    <p className="text-xl text-white/70">Find the right parts for your equipment quickly and easily</p>
                </motion.div>

                <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white text-center">Search by Different Criteria</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-white/10">
                                    <TabsTrigger value="machine" className="data-[state=active]:bg-gold data-[state=active]:text-navy">By Machine</TabsTrigger>
                                    <TabsTrigger value="vin" className="data-[state=active]:bg-gold data-[state=active]:text-navy">By VIN/Serial</TabsTrigger>
                                    <TabsTrigger value="part" className="data-[state=active]:bg-gold data-[state=active]:text-navy">By Part Number</TabsTrigger>
                                </TabsList>

                                <TabsContent value="machine" className="mt-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-300">Machine Model *</Label>
                                            <Select onValueChange={(v) => setSearchForm(prev => ({ ...prev, machineModel: v }))}>
                                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white"><SelectValue placeholder="Select model" /></SelectTrigger>
                                                <SelectContent>
                                                    {machineCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-300">Serial Number (Optional)</Label>
                                            <Input value={searchForm.machineSerial} onChange={(e) => setSearchForm(prev => ({ ...prev, machineSerial: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" placeholder="Machine serial number" />
                                        </div>
                                    </div>
                                    <Button onClick={() => handleSearch('machine')} disabled={isSearching || !searchForm.machineModel} className="mt-4 btn-primary">
                                        {isSearching ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Searching...</> : 'Search Parts'}
                                    </Button>
                                </TabsContent>

                                <TabsContent value="vin" className="mt-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-300">VIN / Chassis Number *</Label>
                                            <Input value={searchForm.vinNumber} onChange={(e) => setSearchForm(prev => ({ ...prev, vinNumber: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" placeholder="Enter VIN number" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-300">Engine Serial Number</Label>
                                            <Input value={searchForm.engineSerial} onChange={(e) => setSearchForm(prev => ({ ...prev, engineSerial: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" placeholder="Engine serial number" />
                                        </div>
                                    </div>
                                    <Button onClick={() => handleSearch('VIN')} disabled={isSearching || !searchForm.vinNumber} className="mt-4 btn-primary">
                                        {isSearching ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Searching...</> : 'Search by VIN'}
                                    </Button>
                                </TabsContent>

                                <TabsContent value="part" className="mt-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-300">Part Number *</Label>
                                            <Input value={searchForm.partNumber} onChange={(e) => setSearchForm(prev => ({ ...prev, partNumber: e.target.value }))} className="bg-gray-700 border-gray-600 text-white" placeholder="e.g., 123-45-67890" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-300">Category</Label>
                                            <Select>
                                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white"><SelectValue placeholder="All categories" /></SelectTrigger>
                                                <SelectContent>
                                                    {machineCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleSearch('part')} disabled={isSearching || !searchForm.partNumber} className="mt-4 btn-primary">
                                        {isSearching ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Searching...</> : 'Search Part Number'}
                                    </Button>
                                </TabsContent>
                            </Tabs>

                            {searchResult && (
                                <motion.div className="mt-6 p-4 bg-gray-700/50 rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-gold" />
                                        <p className="text-white/70">{searchResult.message}</p>
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <Label className="text-gray-300 mb-3 block">Popular Searches</Label>
                    <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term, i) => (
                            <Button key={i} variant="outline" onClick={() => handleQuickSearch(term)} className="border-gold text-gold hover:bg-gold/10">
                                {term}
                            </Button>
                        ))}
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <FileText className="w-6 h-6 text-gold" />Cross Reference
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-300">
                                <p>Can't find your part number? We can cross-reference parts from different manufacturers.</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>OEM to aftermarket parts</li>
                                    <li>Interchangeable part numbers</li>
                                    <li>Compatible replacements</li>
                                </ul>
                                <Button onClick={() => router.push('/contact')} className="w-full btn-primary mt-4">Request Cross Reference</Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                        <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Phone className="w-6 h-6 text-gold" />Parts Specialist
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-300">
                                <p>Need help finding the right part? Our parts specialists can assist you.</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white/70"><CheckCircle className="w-4 h-4 text-gold" />Call: +966 57 019 6677</div>
                                    <div className="flex items-center gap-2 text-white/70"><CheckCircle className="w-4 h-4 text-gold" />WhatsApp Available</div>
                                    <div className="flex items-center gap-2 text-white/70"><CheckCircle className="w-4 h-4 text-gold" />Response within 2 hours</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
