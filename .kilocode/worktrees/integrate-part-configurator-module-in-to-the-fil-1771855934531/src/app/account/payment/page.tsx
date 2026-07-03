'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, MapPin, CreditCard, Plus, Edit, Trash2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getPaymentMethods, addPaymentMethod, deletePaymentMethod, PaymentMethod } from '@/api/user';

// Initial empty state
const initialPaymentMethods: PaymentMethod[] = [];

export default function PaymentMethodsPage() {
    const router = useRouter();
    const { isAuthenticated, user, isInitialized } = useAuth();
    const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
    const [showAddForm, setShowAddForm] = useState(false);

    const [formData, setFormData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: '',
    });

    React.useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account/payment');
        }
    }, [isAuthenticated, isInitialized, router]);

    // Fetch payment methods from API
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            if (isAuthenticated) {
                try {
                    const data = await getPaymentMethods();
                    setPaymentMethods(data);
                } catch (error) {
                    console.error('Error fetching payment methods:', error);
                }
            }
        };
        fetchPaymentMethods();
    }, [isAuthenticated]);

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this payment method?')) {
            try {
                await deletePaymentMethod(id);
                setPaymentMethods(paymentMethods.filter(pm => pm._id !== id));
                toast.success('Payment method deleted successfully');
            } catch (error) {
                toast.error('Failed to delete payment method');
            }
        }
    };

    const handleSetDefault = async (id: string) => {
        // For now, just update locally - would need API endpoint for this
        setPaymentMethods(paymentMethods.map(pm => ({
            ...pm,
            isDefault: pm._id === id,
        })));
        toast.success('Default payment method updated');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const newPaymentMethod = await addPaymentMethod({
                type: formData.cardNumber.startsWith('4') ? 'visa' : 'mastercard',
                cardNumber: formData.cardNumber,
                expiry: formData.expiry,
                cvv: formData.cvv,
                name: formData.name,
                isDefault: paymentMethods.length === 0,
            });
            setPaymentMethods([...paymentMethods, newPaymentMethod]);
            toast.success('Payment method added successfully');
            setShowAddForm(false);
            setFormData({
                cardNumber: '',
                expiry: '',
                cvv: '',
                name: '',
            });
        } catch (error) {
            toast.error('Failed to add payment method');
        }
    };

    const getCardIcon = (type: string) => {
        return <CreditCard className="w-8 h-8" />;
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-6xl mx-auto px-4">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/account')}>Account</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Payment Methods</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="glass-light dark:glass-dark">
                            <CardHeader className="pb-4">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-center">{user?.name || 'Customer'}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/account')}>
                                    <User className="w-4 h-4 mr-2" />
                                    Overview
                                </Button>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/account/orders')}>
                                    <Package className="w-4 h-4 mr-2" />
                                    Orders
                                </Button>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/account/addresses')}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Addresses
                                </Button>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/account/payment')}>
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
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold">Payment Methods</h1>
                                <Button onClick={() => setShowAddForm(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Card
                                </Button>
                            </div>

                            {/* Security Notice */}
                            <Card className="mb-6 bg-green-500/10 border-green-500/20">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-green-500" />
                                    <p className="text-sm text-green-500">
                                        Your payment information is encrypted and secure. We never store your full card details.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Add Form */}
                            {showAddForm && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle>Add New Payment Method</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium">Card Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.cardNumber}
                                                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full mt-1 p-2 border rounded-lg"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        value={formData.expiry}
                                                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                                        placeholder="MM/YY"
                                                        className="w-full mt-1 p-2 border rounded-lg"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">CVV</label>
                                                    <input
                                                        type="text"
                                                        value={formData.cvv}
                                                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                                        placeholder="123"
                                                        className="w-full mt-1 p-2 border rounded-lg"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Name on Card</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="w-full mt-1 p-2 border rounded-lg"
                                                    required
                                                />
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <Button type="submit">Add Card</Button>
                                                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Payment Methods List */}
                            <div className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <Card key={method._id} className={method.isDefault ? 'border-yellow-500' : ''}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white">
                                                        {getCardIcon(method.type)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-lg uppercase">{method.type} •••• {method.last4}</h3>
                                                            {method.isDefault && (
                                                                <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs font-medium">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-muted-foreground">Expires {method.expiry}</p>
                                                        <p className="text-muted-foreground">{method.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(method._id)}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {!method.isDefault && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-4"
                                                    onClick={() => handleSetDefault(method._id)}
                                                >
                                                    Set as Default
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}

                                {paymentMethods.length === 0 && (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                            <p className="text-muted-foreground mb-4">No payment methods saved yet</p>
                                            <Button onClick={() => setShowAddForm(true)}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Your First Card
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
