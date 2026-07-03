'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    User, Package, MapPin, Bell, ArrowLeft, Truck,
    CheckCircle, Clock, XCircle, FileText, RotateCcw,
    MessageCircle, Download, ShoppingBag, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { getOrderById, Order } from '@/api/user';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated, user, isInitialized } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [showSupportDialog, setShowSupportDialog] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [supportMessage, setSupportMessage] = useState('');

    // Fetch order from API
    useEffect(() => {
        const fetchOrder = async () => {
            if (!isInitialized) return;
            if (!isAuthenticated) {
                router.push('/login?redirect=/account/orders');
                return;
            }

            const orderId = params.id;
            if (!orderId) {
                setError('Order ID not found');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await getOrderById(orderId as string);
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Failed to load order details');
                toast.error('Could not load order details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [isInitialized, isAuthenticated, router, params.id]);

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
                    <p className="text-slate-400 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-navy text-white flex items-center justify-center p-4">
                <Card className="glass border-white/10 max-w-md w-full p-8 text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
                    <p className="text-slate-400 mb-6">{error || "We couldn't find the order you're looking for."}</p>
                    <Button onClick={() => router.push('/account/orders')} className="bg-gold text-navy hover:bg-yellow w-full h-12 font-bold">
                        Back to My Orders
                    </Button>
                </Card>
            </div>
        );
    }

    const statusConfig: Record<string, { bg: string; icon: React.ReactNode; text: string }> = {
        pending: { bg: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30', icon: <Clock className="w-4 h-4" />, text: 'Pending' },
        processing: { bg: 'bg-blue-500/20 text-blue-500 border-blue-500/30', icon: <FileText className="w-4 h-4" />, text: 'Processing' },
        shipped: { bg: 'bg-purple-500/20 text-purple-500 border-purple-500/30', icon: <Truck className="w-4 h-4" />, text: 'Shipped' },
        out_for_delivery: { bg: 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30', icon: <Truck className="w-4 h-4" />, text: 'Out for Delivery' },
        delivered: { bg: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30', icon: <CheckCircle className="w-4 h-4" />, text: 'Delivered' },
        cancelled: { bg: 'bg-red-500/20 text-red-500 border-red-500/30', icon: <XCircle className="w-4 h-4" />, text: 'Cancelled' },
    };

    const currentStatus = statusConfig[order.status] || statusConfig.pending;

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
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/account/orders')} className="hover:text-gold transition-colors">Orders</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-600" />
                        <BreadcrumbPage className="text-gold font-medium">#{order._id.slice(-8).toUpperCase()}</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/account/orders')}
                            className="text-slate-400 hover:text-gold bg-white/5 border border-white/5"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold font-display text-white">Order Details</h1>
                                <Badge className={`${currentStatus.bg} border-none px-3 py-1 flex items-center gap-1.5`}>
                                    <div className="w-3.5 h-3.5">
                                        {currentStatus.icon}
                                    </div>
                                    <span className="capitalize text-[10px] font-bold tracking-widest">{currentStatus.text}</span>
                                </Badge>
                            </div>
                            <p className="text-slate-400 mt-1">
                                Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })} at {new Date(order.createdAt).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="bg-white/5 text-slate-300 hover:text-gold border border-white/5 h-11 px-6">
                            <Download className="w-4 h-4 mr-2" />
                            Invoice
                        </Button>
                        <Button className="bg-gold hover:bg-yellow text-navy font-bold h-11 px-8 shadow-lg shadow-gold/20">
                            Track Order
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Items & Timeline */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card className="glass border-white/5 overflow-hidden">
                            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                                <CardTitle className="text-lg font-display flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-gold" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-white/5">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="p-6 flex gap-6 hover:bg-white/[0.01] transition-colors">
                                            <div className="w-24 h-24 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 group">
                                                <img
                                                    src={item.product?.image || '/placeholder-product.png'}
                                                    alt={item.product?.name || 'Product'}
                                                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <p className="text-[10px] text-gold/60 uppercase tracking-widest font-bold mb-1">
                                                        {item.product?.brand || 'Premium Part'}
                                                    </p>
                                                    <h3 className="text-white font-bold text-lg leading-snug group-hover:text-gold transition-colors">
                                                        {item.product?.name || 'Replacement Component'}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 mt-1">SKU: {item.product?.sku || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-slate-400 text-xs font-medium">
                                                        Qty: {item.quantity}
                                                    </div>
                                                    <p className="text-lg font-bold text-white">KWD {(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipment History / Timeline */}
                        <Card className="glass border-white/5">
                            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                                <CardTitle className="text-lg font-display flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-gold" />
                                    Tracking Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-white/5">
                                    {['delivered', 'shipped', 'processing', 'pending'].map((status, idx) => {
                                        const isPast = idx >= ['delivered', 'shipped', 'processing', 'pending'].indexOf(order.status);
                                        const isCurrent = order.status === status;

                                        return (
                                            <div key={status} className={`relative pl-12 ${!isPast ? 'opacity-30 grayscale' : ''}`}>
                                                <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-navy shadow-xl ${isPast ? 'bg-gold text-navy' : 'bg-slate-800 text-slate-600'}`}>
                                                    {status === 'delivered' ? <CheckCircle className="w-4 h-4" /> :
                                                        status === 'shipped' ? <Truck className="w-4 h-4" /> :
                                                            status === 'processing' ? <FileText className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold uppercase tracking-widest text-[11px] mb-1 ${isCurrent ? 'text-gold' : 'text-slate-400'}`}>
                                                        {status.replace('_', ' ')}
                                                    </h4>
                                                    <p className="text-white font-medium">
                                                        {status === 'delivered' ? 'Item has been delivered successfully' :
                                                            status === 'shipped' ? 'Package is in transit to destination' :
                                                                status === 'processing' ? 'Your order is being prepared and packed' : 'Order received and payment verified'}
                                                    </p>
                                                    {isPast && (
                                                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
                                                            {idx === 3 ? formatDateLong(order.createdAt) : 'Verification in progress'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Summaries */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <Card className="glass border-white/5 bg-gold/[0.02] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors" />
                            <CardHeader>
                                <CardTitle className="text-lg font-display">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 pb-4 border-b border-white/5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Subtotal</span>
                                        <span className="text-white font-medium">KWD {(order.totalAmount - 5).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Shipping</span>
                                        <span className="text-emerald-400 font-medium">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Taxes</span>
                                        <span className="text-white font-medium">KWD 5.00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-white font-bold uppercase tracking-wider text-xs">Total Amount</span>
                                    <span className="text-2xl font-bold text-gold">KWD {order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:text-gold hover:bg-white/5 h-11" onClick={() => setShowSupportDialog(true)}>
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Contact Support
                                    </Button>
                                    {order.status === 'delivered' && (
                                        <Button variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/5 h-10 text-xs" onClick={() => setShowReturnDialog(true)}>
                                            <RotateCcw className="w-3.5 h-3.5 mr-2" />
                                            Return Items
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping & Payment */}
                        <Card className="glass border-white/5">
                            <CardHeader>
                                <CardTitle className="text-lg font-display">Logistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gold">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Shipping Address</span>
                                    </div>
                                    <div className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="font-bold text-white mb-1">{order.shippingAddress?.name || user?.name || 'Valued Customer'}</p>
                                        <p>{order.shippingAddress?.street1 || 'No address provided'}</p>
                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                                        <p>{order.shippingAddress?.country || 'Saudi Arabia'}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gold">
                                        <CreditCard className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Payment Method</span>
                                    </div>
                                    <div className="text-sm text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 bg-white/10 rounded border border-white/10" />
                                            <span>•••• 4242</span>
                                        </div>
                                        <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 uppercase font-bold px-1.5 h-5">Verified</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Support Dialog */}
            <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
                <DialogContent className="bg-navy border-white/10 text-white max-w-md rounded-2xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold font-display">Need Assistance?</DialogTitle>
                        <DialogDescription className="text-slate-400 pt-2">
                            Regarding Order #{order._id.slice(-8).toUpperCase()}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Message</Label>
                            <Textarea
                                placeholder="How can we help you with this order?"
                                value={supportMessage}
                                onChange={(e) => setSupportMessage(e.target.value)}
                                className="bg-white/5 border-white/10 text-white rounded-xl min-h-[120px] focus:border-gold/50"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-3 sm:gap-0">
                        <Button variant="ghost" onClick={() => setShowSupportDialog(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                        <Button onClick={() => { toast.success('Support ticket created. We will be in touch soon.'); setShowSupportDialog(false); }} className="bg-gold text-navy font-bold px-8">Send Message</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Return Dialog */}
            <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
                <DialogContent className="bg-navy border-white/10 text-white max-w-md rounded-2xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold font-display">Initiate Return</DialogTitle>
                        <DialogDescription className="text-slate-400 pt-2">
                            Standard 14-day return policy applies.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Reason for return</Label>
                            <Textarea
                                placeholder="Please describe the issue with the items..."
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                className="bg-white/5 border-white/10 text-white rounded-xl min-h-[120px] focus:border-gold/50"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-3 sm:gap-0">
                        <Button variant="ghost" onClick={() => setShowReturnDialog(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                        <Button onClick={() => { toast.success('Return request submitted.'); setShowReturnDialog(false); }} className="bg-red-500 hover:bg-red-600 text-white font-bold px-8">Confirm Return</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function formatDateLong(dateString: string) {
    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}
