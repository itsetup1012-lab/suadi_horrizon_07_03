'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const stores = [
    {
        name: 'Main Branch - Kuwait City',
        address: 'Al-Masail Street, Al-Masail Complex, Kuwait City',
        phone: '+965 2222 3333',
        hours: 'Mon-Sat: 8AM-8PM',
        lat: 29.3759,
        lng: 47.9774,
        services: ['Parts Counter', 'Tool Rental', 'Service Center', 'Showroom'],
    },
    {
        name: 'Farwaniya Branch',
        address: 'Industrial Area, Block 5, Farwaniya',
        phone: '+965 2444 5555',
        hours: 'Mon-Sat: 7AM-7PM',
        lat: 29.2733,
        lng: 47.9581,
        services: ['Parts Counter', 'Tool Rental', 'Quick Service'],
    },
    {
        name: 'Ahmadi Branch',
        address: 'Ahmadi Industrial Area, Block 12, Ahmadi',
        phone: '+965 2555 6666',
        hours: 'Mon-Sat: 7AM-6PM',
        lat: 29.0797,
        lng: 48.0839,
        services: ['Parts Counter', 'Heavy Equipment Showroom'],
    },
];

export default function StoresPage() {
    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Store Locations</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold mb-4">Store Locations</h1>
                    <p className="text-muted-foreground mb-8">Visit our branches across Kuwait for parts, service, and equipment</p>

                    {/* Store Cards */}
                    <div className="space-y-6 mb-12">
                        {stores.map((store, index) => (
                            <motion.div
                                key={store.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="glass-light dark:glass-dark hover:border-primary/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Map Placeholder */}
                                            <div className="w-full md:w-1/3 bg-muted/50 rounded-lg min-h-[150px] flex items-center justify-center">
                                                <div className="text-center">
                                                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                                                    <p className="text-sm text-muted-foreground">Map View</p>
                                                </div>
                                            </div>

                                            {/* Store Info */}
                                            <div className="flex-1">
                                                <h3 className="font-bold text-xl mb-2">{store.name}</h3>
                                                <p className="text-muted-foreground mb-4">{store.address}</p>

                                                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-primary" />
                                                        <span className="text-sm">{store.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-primary" />
                                                        <span className="text-sm">{store.hours}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {store.services.map((service) => (
                                                        <span key={service} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button size="sm">
                                                        Get Directions
                                                        <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        Call Store
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <Card className="glass-strong">
                        <CardContent className="p-6 text-center">
                            <h3 className="font-bold text-xl mb-2">Need Help Finding the Right Store?</h3>
                            <p className="text-muted-foreground mb-4">
                                Our team can help you find the nearest location with the services you need
                            </p>
                            <div className="flex justify-center gap-3">
                                <Button>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Us: +965 2222 3333
                                </Button>
                                <Button variant="outline">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    View All Locations
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
