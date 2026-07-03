'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, Package, ChevronRight, Plus, X, CheckCircle, Clock, XCircle, FileText, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock return requests data
const mockReturns = [
    {
        id: 'RET-12345678',
        orderId: 'SH-12345678',
        productName: 'Hydraulic Pump Assembly',
        date: '2024-01-20',
        status: 'approved',
        reason: 'Defective part',
    },
    {
        id: 'RET-23456789',
        orderId: 'SH-23456789',
        productName: 'Engine Filter Set',
        date: '2024-01-18',
        status: 'pending',
        reason: 'Wrong item ordered',
    },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    pending: {
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/20 border-yellow-500/30',
        icon: <Clock className="w-4 h-4" />,
    },
    approved: {
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/20 border-emerald-500/30',
        icon: <CheckCircle className="w-4 h-4" />,
    },
    rejected: {
        color: 'text-red-500',
        bg: 'bg-red-500/20 border-red-500/30',
        icon: <XCircle className="w-4 h-4" />,
    },
    processing: {
        color: 'text-blue-500',
        bg: 'bg-blue-500/20 border-blue-500/30',
        icon: <Truck className="w-4 h-4" />,
    },
};

export default function ReturnsPage() {
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();
    const [showNewReturn, setShowNewReturn] = useState(false);
    const [newReturn, setNewReturn] = useState({
        orderId: '',
        productName: '',
        reason: '',
        description: '',
    });

    React.useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account/returns');
        }
    }, [isAuthenticated, isInitialized, router]);

    const handleSubmitReturn = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Return request submitted successfully');
        setShowNewReturn(false);
        setNewReturn({ orderId: '', productName: '', reason: '', description: '' });
    };

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
                        <BreadcrumbPage className="text-gold font-medium">Returns</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-display">Return Requests</h1>
                        <p className="text-slate-400 mt-1">
                            Track and manage your return requests
                        </p>
                    </div>
                    <Button
                        className="bg-gold hover:bg-yellow text-navy font-bold"
                        onClick={() => setShowNewReturn(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Return
                    </Button>
                </div>

                {/* New Return Form Modal */}
                <AnimatePresence>
                    {showNewReturn && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowNewReturn(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-navy border border-white/10 rounded-xl max-w-lg w-full p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Request a Return</h2>
                                    <button
                                        onClick={() => setShowNewReturn(false)}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmitReturn} className="space-y-4">
                                    <div>
                                        <Label htmlFor="orderId" className="text-slate-300">Order ID</Label>
                                        <Input
                                            id="orderId"
                                            value={newReturn.orderId}
                                            onChange={(e) => setNewReturn({ ...newReturn, orderId: e.target.value })}
                                            placeholder="e.g., SH-12345678"
                                            className="bg-white/5 border-white/10 text-white mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="productName" className="text-slate-300">Product Name</Label>
                                        <Input
                                            id="productName"
                                            value={newReturn.productName}
                                            onChange={(e) => setNewReturn({ ...newReturn, productName: e.target.value })}
                                            placeholder="Enter product name"
                                            className="bg-white/5 border-white/10 text-white mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="reason" className="text-slate-300">Reason for Return</Label>
                                        <Select onValueChange={(value) => setNewReturn({ ...newReturn, reason: value })}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                                                <SelectValue placeholder="Select a reason" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-navy border-white/10 text-white">
                                                <SelectItem value="defective">Defective Product</SelectItem>
                                                <SelectItem value="wrong">Wrong Item Ordered</SelectItem>
                                                <SelectItem value="notneeded">No Longer Needed</SelectItem>
                                                <SelectItem value="damaged">Damaged in Shipping</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="description" className="text-slate-300">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={newReturn.description}
                                            onChange={(e) => setNewReturn({ ...newReturn, description: e.target.value })}
                                            placeholder="Please provide additional details..."
                                            className="bg-white/5 border-white/10 text-white mt-1"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 border-white/10 text-slate-300 hover:bg-white/5"
                                            onClick={() => setShowNewReturn(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-gold hover:bg-yellow text-navy font-bold"
                                        >
                                            Submit Request
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Return Requests List */}
                {mockReturns.length > 0 ? (
                    <div className="space-y-4">
                        {mockReturns.map((returnItem, index) => (
                            <motion.div
                                key={returnItem.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="glass border-white/5">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Undo2 className="w-6 h-6 text-gold" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-white">{returnItem.productName}</h3>
                                                        <Badge className={statusConfig[returnItem.status].bg}>
                                                            {statusConfig[returnItem.status].icon}
                                                            <span className="ml-1 capitalize">{returnItem.status}</span>
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-400">
                                                        Return ID: <span className="text-slate-300">{returnItem.id}</span>
                                                    </p>
                                                    <p className="text-sm text-slate-400">
                                                        Order: <span className="text-slate-300">{returnItem.orderId}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 md:text-right">
                                                <div>
                                                    <p className="text-sm text-slate-400">Reason</p>
                                                    <p className="text-white capitalize">{returnItem.reason}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-400">Date</p>
                                                    <p className="text-white">{returnItem.date}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gold hover:text-white"
                                                >
                                                    View Details
                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 mb-6">
                            <Undo2 className="w-10 h-10 text-gold" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No return requests</h2>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">
                            You haven't submitted any return requests yet. If you need to return a product, click the button above.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
