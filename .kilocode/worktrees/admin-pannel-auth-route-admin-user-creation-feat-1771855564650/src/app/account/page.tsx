'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, MapPin, CreditCard, Settings, Bell, ChevronRight, ShoppingBag, FileText, Heart, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for demonstration
const mockOrders = [
    { id: 'SH-12345678', date: '2024-01-15', status: 'delivered', total: 1250, items: 3 },
    { id: 'SH-23456789', date: '2024-01-10', status: 'shipped', total: 780, items: 2 },
];

const mockWishlist = [
    { id: '1', name: 'Hydraulic Pump Assembly', price: 450, image: '/images/home/hydraulics.png' },
    { id: '2', name: 'Engine Filter Set', price: 89, image: '/images/home/engine.png' },
];

const accountLinks = [
    { icon: <ShoppingBag className="w-5 h-5" />, title: 'Orders', description: 'View and track your orders', href: '/account/orders' },
    { icon: <Heart className="w-5 h-5" />, title: 'Wishlist', description: 'Your saved products', href: '/account/wishlist' },
    { icon: <Undo2 className="w-5 h-5" />, title: 'Returns', description: 'Track return requests', href: '/account/returns' },
    { icon: <MapPin className="w-5 h-5" />, title: 'Addresses', description: 'Manage shipping addresses', href: '/account/addresses' },
    { icon: <CreditCard className="w-5 h-5" />, title: 'Payment Methods', description: 'Manage payment options', href: '/account/payment' },
    { icon: <Bell className="w-5 h-5" />, title: 'Notifications', description: 'Manage preferences', href: '/account/notifications' },
    { icon: <Settings className="w-5 h-5" />, title: 'Account Settings', description: 'Profile and security', href: '/account/settings' },
];

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    processing: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    delivered: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    cancelled: 'bg-red-500/20 text-red-500 border-red-500/30',
};

export default function AccountPage() {
    const router = useRouter();
    const { isAuthenticated, user, isInitialized } = useAuth();

    React.useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account');
        }
    }, [isAuthenticated, isInitialized, router]);

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-navy text-white py-8 relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList className="text-slate-400">
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')} className="hover:text-gold transition-colors">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-600" />
                        <BreadcrumbPage className="text-gold font-medium">My Account</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="glass border-white/5">
                            <CardHeader className="pb-4">
                                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-gold" />
                                </div>
                                <CardTitle className="text-center text-white font-display">{user?.name || 'Customer'}</CardTitle>
                                <p className="text-sm text-slate-400 text-center">{user?.email || 'customer@example.com'}</p>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account')}>
                                    <User className="w-4 h-4 mr-2" />
                                    Overview
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/orders')}>
                                    <Package className="w-4 h-4 mr-2" />
                                    Orders
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/wishlist')}>
                                    <Heart className="w-4 h-4 mr-2" />
                                    Wishlist
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/returns')}>
                                    <Undo2 className="w-4 h-4 mr-2" />
                                    Returns
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/addresses')}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Addresses
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/payment')}>
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Payment Methods
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl font-bold mb-6 font-display text-white">Welcome back!</h1>

                            {/* Quick Stats */}
                            <div className="grid sm:grid-cols-3 gap-4 mb-8">
                                <Card className="glass border-white/5">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gold" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{mockOrders.length}</p>
                                                <p className="text-sm text-slate-400">Total Orders</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="glass border-white/5">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                <Package className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">1</p>
                                                <p className="text-sm text-slate-400">In Transit</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="glass border-white/5">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                                <Heart className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{mockWishlist.length}</p>
                                                <p className="text-sm text-slate-400">In Wishlist</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Orders */}
                            <Card className="glass border-white/5 mb-6">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
                                    <CardTitle className="text-white font-display">Recent Orders</CardTitle>
                                    <Button variant="ghost" size="sm" className="text-gold hover:text-white" onClick={() => router.push('/account/orders')}>
                                        View All
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-gold/20"
                                                onClick={() => router.push(`/account/orders/${order.id}`)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white">{order.id}</p>
                                                        <p className="text-sm text-slate-400">{order.date} • {order.items} items</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge className={statusColors[order.status]}>
                                                        {order.status}
                                                    </Badge>
                                                    <span className="font-semibold text-white">KWD {order.total.toFixed(2)}</span>
                                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Account Links */}
                            <h2 className="text-xl font-semibold mb-4 text-white font-display">Quick Access</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {accountLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card
                                            className="glass border-white/5 hover:border-gold/30 hover:bg-white/5 transition-all cursor-pointer"
                                            onClick={() => router.push(link.href)}
                                        >
                                            <CardContent className="p-4 flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center text-gold">
                                                    {link.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-white">{link.title}</p>
                                                    <p className="text-sm text-slate-400">{link.description}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
