'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, ChevronRight, MapPin, Clock, CheckCircle, FileText, Truck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getOrders, Order } from '@/api/user';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    processing: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    delivered: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    cancelled: 'bg-red-500/20 text-red-500 border-red-500/30',
};

const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4" />,
    processing: <FileText className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    delivered: <CheckCircle className="w-4 h-4" />,
    cancelled: <Package className="w-4 h-4" />,
};

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    React.useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account/orders');
        }
    }, [isAuthenticated, isInitialized, router]);

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            if (isAuthenticated) {
                try {
                    const data = await getOrders();
                    setOrders(data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchOrders();
    }, [isAuthenticated]);

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-navy text-white py-8 relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList className="text-slate-400">
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')} className="hover:text-gold transition-colors">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-600" />
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/account')} className="hover:text-gold transition-colors">Account</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-600" />
                        <BreadcrumbPage className="text-gold font-medium">Orders</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-display">My Orders</h1>
                        <p className="text-slate-400 mt-1">{orders.length} total orders</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search by order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-navy border-white/10 text-white">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order: Order, index: number) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="glass border-white/5 hover:border-gold/30 transition-all">
                                    <CardContent className="p-6">
                                        {/* Order Header */}
                                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3
                                                        className="font-semibold text-lg text-white cursor-pointer hover:text-gold transition-colors"
                                                        onClick={() => router.push(`/account/orders/${order._id}`)}
                                                    >
                                                        {order._id}
                                                    </h3>
                                                    <Badge className={statusColors[order.status]}>
                                                        {statusIcons[order.status]}
                                                        <span className="ml-1 capitalize">{order.status}</span>
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-xl text-white">KWD {order.totalAmount.toFixed(2)}</p>
                                                <p className="text-sm text-slate-400">{order.items.length} items</p>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="space-y-3 mb-4">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-slate-300">{item.product?.name || 'Product'} × {item.quantity}</span>
                                                    <span className="text-slate-400">KWD {(item.product?.price || 0 * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tracking Info */}
                                        <div className="bg-white/5 rounded-lg p-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                {statusIcons[order.status]}
                                                <span className="font-medium text-white">Status: {order.status}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm mt-2 text-slate-400">
                                                <Clock className="w-4 h-4" />
                                                <span>
                                                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 flex-wrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-white/10 text-slate-300 hover:text-gold hover:border-gold/30"
                                                onClick={() => router.push(`/account/orders/${order._id}`)}
                                            >
                                                Track Order
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-white/10 text-slate-300 hover:text-gold hover:border-gold/30"
                                                onClick={() => router.push(`/account/orders/${order._id}`)}
                                            >
                                                View Details
                                            </Button>
                                            {order.status === 'delivered' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-white/10 text-slate-300 hover:text-gold hover:border-gold/30"
                                                >
                                                    Buy Again
                                                </Button>
                                            )}
                                            {order.status === 'delivered' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                                    onClick={() => router.push('/account/returns')}
                                                >
                                                    Return Item
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 mb-6">
                                <Package className="w-10 h-10 text-gold" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {searchQuery || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
                            </h2>
                            <p className="text-slate-400 mb-6">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Start shopping to see your orders here'}
                            </p>
                            {searchQuery || statusFilter !== 'all' ? (
                                <Button
                                    variant="outline"
                                    className="border-gold text-gold hover:bg-gold/10"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            ) : (
                                <Button
                                    className="bg-gold hover:bg-yellow text-navy font-bold"
                                    onClick={() => router.push('/products')}
                                >
                                    Browse Products
                                </Button>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
