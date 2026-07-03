'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Undo2, Package, ChevronRight, Plus, X, CheckCircle,
    Clock, XCircle, FileText, Truck, User, Heart,
    MapPin, Settings, Bell, Search, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getReturns, createReturnRequest, ReturnRequest } from '@/api/user';

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    pending: {
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/20 border-yellow-500/30',
        icon: <Clock className="w-3.5 h-3.5" />,
    },
    approved: {
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/20 border-emerald-500/30',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
    rejected: {
        color: 'text-red-500',
        bg: 'bg-red-500/20 border-red-500/30',
        icon: <XCircle className="w-3.5 h-3.5" />,
    },
    processing: {
        color: 'text-blue-500',
        bg: 'bg-blue-500/20 border-blue-500/30',
        icon: <Truck className="w-3.5 h-3.5" />,
    },
    completed: {
        color: 'text-slate-400',
        bg: 'bg-white/5 border-white/10',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
};

export default function ReturnsPage() {
    const router = useRouter();
    const { isAuthenticated, user, isInitialized } = useAuth();
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNewReturn, setShowNewReturn] = useState(false);
    const [newReturn, setNewReturn] = useState({
        orderId: '',
        productId: 'general', // Default if not specific
        productName: '',
        reason: '',
        description: '',
    });

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account/returns');
            return;
        }

        if (isAuthenticated) {
            fetchReturns();
        }
    }, [isAuthenticated, isInitialized, router]);

    const fetchReturns = async () => {
        try {
            setIsLoading(true);
            const data = await getReturns();
            setReturns(data);
        } catch (error) {
            console.error('Error fetching returns:', error);
            toast.error('Failed to load return requests');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitReturn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReturn.reason) {
            toast.error('Please select a reason for return');
            return;
        }

        try {
            setIsSubmitting(true);
            await createReturnRequest(newReturn);
            toast.success('Return request submitted successfully');
            setShowNewReturn(false);
            setNewReturn({ orderId: '', productId: 'general', productName: '', reason: '', description: '' });
            fetchReturns(); // Refresh list
        } catch (error) {
            console.error('Error submitting return:', error);
            toast.error('Could not submit return request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/account')} className="hover:text-gold transition-colors">Account</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-600" />
                        <BreadcrumbPage className="text-gold font-medium">Returns</BreadcrumbPage>
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
                                <Button variant="ghost" className="w-full justify-start text-gold bg-white/5" onClick={() => router.push('/account/returns')}>
                                    <Undo2 className="w-4 h-4 mr-2" />
                                    Returns
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/addresses')}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Addresses
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/settings')}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/notifications')}>
                                    <Bell className="w-4 h-4 mr-2" />
                                    Notifications
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-bold font-display text-white">Returns</h1>
                                <Button
                                    className="bg-gold hover:bg-yellow text-navy font-bold shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5"
                                    onClick={() => setShowNewReturn(true)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Request Return
                                </Button>
                            </div>

                            <Card className="glass border-white/5 p-6 min-h-[400px]">
                                {isLoading ? (
                                    <div className="h-64 flex items-center justify-center">
                                        <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {returns.length > 0 ? (
                                            returns.map((returnItem, index) => {
                                                const config = statusConfig[returnItem.status] || statusConfig.pending;
                                                return (
                                                    <div key={returnItem._id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all group">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                                    <Undo2 className="w-6 h-6 text-gold" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                        <h3 className="font-bold text-white uppercase tracking-tight group-hover:text-gold transition-colors">{returnItem.productName}</h3>
                                                                        <Badge className={`${config.bg} border-none flex items-center gap-1.5`}>
                                                                            {config.icon}
                                                                            <span className="capitalize text-[10px] font-bold tracking-wider">{returnItem.status}</span>
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                                                                        <span className="flex items-center gap-1.5">
                                                                            <span className="text-slate-600 font-bold uppercase text-[10px]">Return ID</span> {returnItem._id.slice(-8).toUpperCase()}
                                                                        </span>
                                                                        <span className="flex items-center gap-1.5">
                                                                            <span className="text-slate-600 font-bold uppercase text-[10px]">Order ID</span> {returnItem.orderId}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-slate-500 mt-2 italic flex items-center gap-2">
                                                                        <span className="text-slate-700 not-italic uppercase text-[10px] font-bold tracking-widest">Reason</span> {returnItem.reason}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col md:items-end gap-3 self-end md:self-center">
                                                                <div className="text-sm text-slate-400 font-medium whitespace-nowrap">
                                                                    {new Date(returnItem.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                                </div>
                                                                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-gold bg-white/5 border-none h-8 px-4 font-bold text-[10px] uppercase tracking-wider">
                                                                    View Details
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-24">
                                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 text-slate-700">
                                                    <Undo2 className="w-10 h-10" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-white font-display">No Return Requests</h2>
                                                <p className="text-slate-400 max-w-sm mx-auto mt-3">
                                                    If you need to return a part, you can initiate a request here or through your order details page.
                                                </p>
                                                <Button
                                                    onClick={() => setShowNewReturn(true)}
                                                    className="mt-8 bg-gold/10 hover:bg-gold text-gold hover:text-navy border border-gold/20 font-bold transition-all"
                                                >
                                                    Start a Return Request
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* New Return Form Modal */}
            <AnimatePresence>
                {showNewReturn && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-navy/80 backdrop-blur-md"
                            onClick={() => setShowNewReturn(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-navy border border-white/10 rounded-2xl max-w-lg w-full p-8 relative z-10 overflow-hidden shadow-2xl shadow-gold/5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button
                                    onClick={() => setShowNewReturn(false)}
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-8 pr-12">
                                <h2 className="text-2xl font-bold text-white font-display mb-2">Request a Return</h2>
                                <p className="text-slate-400 text-sm">Please provide the details below to start your return request.</p>
                            </div>

                            <form onSubmit={handleSubmitReturn} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="orderId" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest ml-1">Order ID</Label>
                                    <Input
                                        id="orderId"
                                        value={newReturn.orderId}
                                        onChange={(e) => setNewReturn({ ...newReturn, orderId: e.target.value })}
                                        placeholder="SH-00000000"
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-gold/50 transition-all placeholder:text-slate-600"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="productName" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest ml-1">Product Name</Label>
                                    <Input
                                        id="productName"
                                        value={newReturn.productName}
                                        onChange={(e) => setNewReturn({ ...newReturn, productName: e.target.value })}
                                        placeholder="Full name of the item"
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-gold/50 transition-all placeholder:text-slate-600"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reason" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest ml-1">Reason for Return</Label>
                                    <Select onValueChange={(value) => setNewReturn({ ...newReturn, reason: value })}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-gold/50 transition-all">
                                            <SelectValue placeholder="Select a reason" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-navy border-white/10 text-white rounded-xl">
                                            <SelectItem value="Defective Product">Defective Product</SelectItem>
                                            <SelectItem value="Wrong Item Ordered">Wrong Item Ordered</SelectItem>
                                            <SelectItem value="No Longer Needed">No Longer Needed</SelectItem>
                                            <SelectItem value="Damaged in Shipping">Damaged in Shipping</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest ml-1">Additional Details</Label>
                                    <Textarea
                                        id="description"
                                        value={newReturn.description}
                                        onChange={(e) => setNewReturn({ ...newReturn, description: e.target.value })}
                                        placeholder="Tell us what happened..."
                                        className="bg-white/5 border-white/10 text-white rounded-xl focus:border-gold/50 transition-all min-h-[100px] placeholder:text-slate-600"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gold hover:bg-yellow text-navy font-bold h-12 rounded-xl mt-4 text-lg shadow-lg shadow-gold/10 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
