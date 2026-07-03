'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { FloatingParticles, AnimatedConnector } from "@/components/effects/SceneEffects";

interface OrderDetails {
    _id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    totalAmount: number;
    items: Array<{
        product: string;
        quantity: number;
        price: number;
    }>;
    shippingAddress: {
        name: string;
        company?: string;
        street1: string;
        street2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        phone?: string;
        email?: string;
    };
    trackingNumber?: string;
}

const statusSteps = [
    { id: 'pending', label: 'Order Placed', icon: Clock },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-emerald-500',
    cancelled: 'bg-red-500',
};

export default function OrderTrackingPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const response = await fetch('/api/orders/lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, email, phone }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to find order');
                return;
            }

            setOrder(data);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentStepIndex = () => {
        if (!order) return 0;
        const statusIndex = statusSteps.findIndex(s => s.id === order.status);
        return statusIndex >= 0 ? statusIndex : 0;
    };

    return (
        <div className="min-h-screen bg-navy relative">
            <FloatingParticles />

            <div className="container mx-auto px-4 py-8 relative z-10">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-slate-400">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-white">Track Order</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto"
                >
                    <Card className="bg-charcoal/80 border-white/10">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-display text-white">Track Your Order</CardTitle>
                            <CardDescription className="text-slate-400">
                                Enter your order details to track your shipment
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="orderId" className="text-slate-300">Order ID</Label>
                                    <Input
                                        id="orderId"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        placeholder="Enter your order ID"
                                        className="bg-navy/50 border-white/10 text-white placeholder:text-slate-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-300">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="bg-navy/50 border-white/10 text-white placeholder:text-slate-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+966..."
                                            className="bg-navy/50 border-white/10 text-white placeholder:text-slate-500"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-gold text-charcoal font-black"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin">⟳</span>
                                            Searching...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Search className="w-4 h-4" />
                                            Track Order
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-8"
                        >
                            {/* Order Status Timeline */}
                            <Card className="bg-charcoal/80 border-white/10 mb-6">
                                <CardHeader>
                                    <CardTitle className="text-xl text-white flex items-center gap-2">
                                        <Package className="w-5 h-5 text-gold" />
                                        Order Status
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">
                                        Order #{order.orderNumber}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between relative">
                                        {/* Progress Line */}
                                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 z-0" />
                                        <div
                                            className="absolute top-1/2 left-0 h-1 bg-gold -translate-y-1/2 z-0 transition-all duration-500"
                                            style={{ width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%` }}
                                        />

                                        {statusSteps.map((step, index) => {
                                            const Icon = step.icon;
                                            const isCompleted = index <= getCurrentStepIndex();
                                            const isCurrent = index === getCurrentStepIndex();

                                            return (
                                                <div key={step.id} className="relative z-10 flex flex-col items-center">
                                                    <div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                                ? 'bg-gold text-charcoal'
                                                                : 'bg-white/10 text-slate-500'
                                                            } ${isCurrent ? 'ring-4 ring-gold/30' : ''}`}
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <span className={`mt-2 text-xs font-medium ${isCompleted ? 'text-white' : 'text-slate-500'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {order.trackingNumber && (
                                        <div className="mt-6 p-4 bg-navy/50 rounded-lg">
                                            <p className="text-sm text-slate-400">Tracking Number</p>
                                            <p className="text-white font-mono">{order.trackingNumber}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Details */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="bg-charcoal/80 border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-white">Order Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Order Date</span>
                                            <span className="text-white">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Status</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status] || 'bg-slate-500'
                                                } text-white`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Total Amount</span>
                                            <span className="text-gold font-bold">${order.totalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Items</span>
                                            <span className="text-white">{order.items?.length || 0} items</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-charcoal/80 border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-white flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gold" />
                                            Shipping Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-white font-medium">{order.shippingAddress?.name}</p>
                                        <p className="text-slate-400 text-sm">
                                            {order.shippingAddress?.street1}
                                            {order.shippingAddress?.street2 && `, ${order.shippingAddress.street2}`}
                                        </p>
                                        <p className="text-slate-400 text-sm">
                                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                                        </p>
                                        <p className="text-slate-400 text-sm">{order.shippingAddress?.country}</p>

                                        {order.shippingAddress?.phone && (
                                            <div className="flex items-center gap-2 mt-3 text-slate-400">
                                                <Phone className="w-4 h-4" />
                                                <span className="text-sm">{order.shippingAddress.phone}</span>
                                            </div>
                                        )}
                                        {order.shippingAddress?.email && (
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Mail className="w-4 h-4" />
                                                <span className="text-sm">{order.shippingAddress.email}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Items */}
                            <Card className="bg-charcoal/80 border-white/10 mt-6">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">Order Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-navy/30 rounded-lg">
                                                <div>
                                                    <p className="text-white font-medium">Product #{item.product}</p>
                                                    <p className="text-slate-400 text-sm">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-gold font-bold">${item.price.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
