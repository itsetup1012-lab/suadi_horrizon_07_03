'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { toast } from 'sonner';

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    _id: string;
    createdAt: string;
    status: 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled';
    items: OrderItem[];
    total: number;
    shippingAddress: string;
    trackingNumber: string | null;
}

const sampleOrders: Order[] = [
    {
        _id: 'ORD-2024-001',
        createdAt: '2024-12-15T10:00:00.000Z',
        status: 'delivered',
        items: [
            { name: 'CAT 320 Turbocharger', price: 1250, quantity: 1 },
            { name: 'Hydraulic Filter Set', price: 85, quantity: 2 },
        ],
        total: 1420,
        shippingAddress: 'Riyadh, Saudi Arabia',
        trackingNumber: 'TRK123456789',
    },
    {
        _id: 'ORD-2024-002',
        createdAt: '2024-12-20T14:30:00.000Z',
        status: 'shipped',
        items: [
            { name: 'Engine Piston Set', price: 450, quantity: 1 },
        ],
        total: 450,
        shippingAddress: 'Jeddah, Saudi Arabia',
        trackingNumber: 'TRK987654321',
    },
    {
        _id: 'ORD-2025-003',
        createdAt: '2025-01-05T09:15:00.000Z',
        status: 'processing',
        items: [
            { name: 'Alternator 24V', price: 320, quantity: 1 },
            { name: 'Starter Motor', price: 280, quantity: 1 },
        ],
        total: 600,
        shippingAddress: 'Dammam, Saudi Arabia',
        trackingNumber: null,
    },
];

const statusConfig = {
    delivered: { color: 'bg-green-500', icon: CheckCircle, label: 'Delivered' },
    shipped: { color: 'bg-blue-500', icon: Truck, label: 'Shipped' },
    processing: { color: 'bg-yellow-500', icon: Clock, label: 'Processing' },
    pending: { color: 'bg-gray-500', icon: Clock, label: 'Pending' },
    cancelled: { color: 'bg-red-500', icon: Package, label: 'Cancelled' },
};

export default function OrdersPage() {
    const router = useRouter();
    const [orders] = useState<Order[]>(sampleOrders);

    const handleReorder = (orderId: string) => {
        toast.success('Items added to cart', {
            description: 'You can proceed to checkout now.',
        });
    };

    const handleTrackOrder = (trackingNumber: string) => {
        window.open(`https://track.saudihorizon.local/${trackingNumber}`, '_blank');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderOrderCard = (order: Order) => {
        const status = statusConfig[order.status];
        const StatusIcon = status.icon;

        return (
            <Card key={order._id} className="bg-gray-800 border-gray-700 hover:border-yellow-500/30 transition-all">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-white">{order._id}</CardTitle>
                                <Badge className={`${status.color} text-white`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {status.label}
                                </Badge>
                            </div>
                            <CardDescription className="text-gray-400">
                                Ordered on {formatDate(order.createdAt)}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {order.status === 'delivered' && (
                                <Button
                                    size="sm"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                                    onClick={() => handleReorder(order._id)}
                                >
                                    <RotateCcw className="w-4 h-4 mr-1" />
                                    Reorder
                                </Button>
                            )}
                            {order.trackingNumber && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                    onClick={() => handleTrackOrder(order.trackingNumber!)}
                                >
                                    <Truck className="w-4 h-4 mr-1" />
                                    Track
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Items</h4>
                            <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                    <p key={idx} className="text-sm text-white">
                                        {item.name} x{item.quantity}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Shipping Address</h4>
                            <p className="text-sm text-white flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-yellow-500" />
                                {order.shippingAddress}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Total</h4>
                            <p className="text-xl font-bold text-white">
                                SAR {order.total.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-background text-white py-8">
            <div className="max-w-5xl mx-auto px-4">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>My Orders</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl font-bold mb-2 text-white">Order History</h1>
                    <p className="text-gray-300">View and track your past orders</p>
                </motion.div>

                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="bg-gray-800 border-gray-700">
                        <TabsTrigger value="all" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900">All Orders</TabsTrigger>
                        <TabsTrigger value="processing" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900">Processing</TabsTrigger>
                        <TabsTrigger value="shipped" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900">Shipped</TabsTrigger>
                        <TabsTrigger value="delivered" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900">Delivered</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {renderOrderCard(order)}
                            </motion.div>
                        ))}
                    </TabsContent>

                    <TabsContent value="processing" className="space-y-4">
                        {orders.filter(o => o.status === 'processing').map((order) => renderOrderCard(order))}
                    </TabsContent>

                    <TabsContent value="shipped" className="space-y-4">
                        {orders.filter(o => o.status === 'shipped').map((order) => renderOrderCard(order))}
                    </TabsContent>

                    <TabsContent value="delivered" className="space-y-4">
                        {orders.filter(o => o.status === 'delivered').map((order) => renderOrderCard(order))}
                    </TabsContent>
                </Tabs>

                {orders.length === 0 && (
                    <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
                        <p className="text-gray-300 mb-6">Start shopping to see your orders here.</p>
                        <Button
                            onClick={() => router.push('/products')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold"
                        >
                            Browse Products
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
