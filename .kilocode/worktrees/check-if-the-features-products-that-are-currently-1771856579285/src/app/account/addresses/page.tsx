'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, MapPin, CreditCard, Settings, Bell, Plus, Edit, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getAddresses, addAddress, updateAddress, deleteAddress, Address } from '@/api/user';

// Initial empty state
const initialAddresses: Address[] = [];

export default function AddressesPage() {
    const router = useRouter();
    const { isAuthenticated, user, isInitialized } = useAuth();
    const [addresses, setAddresses] = useState(initialAddresses);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Saudi Arabia',
        phone: '',
    });

    React.useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account/addresses');
        }
    }, [isAuthenticated, isInitialized, router]);

    // Fetch addresses from API
    useEffect(() => {
        const fetchAddresses = async () => {
            if (isAuthenticated) {
                try {
                    const data = await getAddresses();
                    setAddresses(data);
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                    // Keep using initial data if API fails
                }
            }
        };
        fetchAddresses();
    }, [isAuthenticated]);

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this address?')) {
            try {
                await deleteAddress(id);
                setAddresses(addresses.filter(addr => addr._id !== id));
                toast.success('Address deleted successfully');
            } catch (error) {
                toast.error('Failed to delete address');
            }
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await updateAddress(id, { isDefault: true });
            setAddresses(addresses.map(addr => ({
                ...addr,
                isDefault: addr._id === id,
            })));
            toast.success('Default address updated');
        } catch (error) {
            toast.error('Failed to update default address');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                const updated = await updateAddress(editingId, formData);
                setAddresses(addresses.map(addr =>
                    addr._id === editingId ? { ...addr, ...formData } : addr
                ));
                toast.success('Address updated successfully');
                setEditingId(null);
            } else {
                const newAddress = await addAddress({
                    ...formData,
                    isDefault: addresses.length === 0,
                });
                setAddresses([...addresses, newAddress]);
                toast.success('Address added successfully');
            }

            setShowAddForm(false);
            setFormData({
                name: '',
                fullName: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'Saudi Arabia',
                phone: '',
            });
        } catch (error) {
            toast.error('Failed to save address');
        }
    };

    const handleEdit = (address: Address) => {
        setFormData({
            name: address.name,
            fullName: address.fullName,
            address: address.address,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
            phone: address.phone,
        });
        setEditingId(address._id);
        setShowAddForm(true);
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
                        <BreadcrumbPage>Addresses</BreadcrumbPage>
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
                                <h1 className="text-3xl font-bold">Shipping Addresses</h1>
                                <Button onClick={() => {
                                    setShowAddForm(true); setEditingId(null); setFormData({
                                        name: '',
                                        fullName: '',
                                        address: '',
                                        city: '',
                                        state: '',
                                        zipCode: '',
                                        country: 'Saudi Arabia',
                                        phone: '',
                                    });
                                }}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Address
                                </Button>
                            </div>

                            {/* Add/Edit Form */}
                            {showAddForm && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle>{editingId ? 'Edit Address' : 'Add New Address'}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium">Address Label</label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="e.g., Home, Office"
                                                        className="w-full mt-1 p-2 border rounded-lg"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                        className="w-full mt-1 p-2 border rounded-lg"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Address</label>
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full mt-1 p-2 border rounded-lg"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium">City</label>
                                                    <input
                                                        type="text"
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="w-full mt-1 p-2 border rounded-lg"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">State/Province</label>
                                                    <input
                                                        type="text"
                                                        value={formData.state}
                                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                        className="w-full mt-1 p-2 border rounded-lg"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium">ZIP Code</label>
                                                    <input
                                                        type="text"
                                                        value={formData.zipCode}
                                                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                                        className="w-full mt-1 p-2 border rounded-lg"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Phone</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full mt-1 p-2 border rounded-lg"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <Button type="submit">{editingId ? 'Update Address' : 'Save Address'}</Button>
                                                <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingId(null); }}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Addresses List */}
                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <Card key={address._id} className={address.isDefault ? 'border-yellow-500' : ''}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold text-lg">{address.name}</h3>
                                                        {address.isDefault && (
                                                            <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs font-medium">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-medium">{address.fullName}</p>
                                                    <p className="text-muted-foreground">{address.address}</p>
                                                    <p className="text-muted-foreground">{address.city}, {address.state} {address.zipCode}</p>
                                                    <p className="text-muted-foreground">{address.country}</p>
                                                    <p className="text-muted-foreground mt-2">{address.phone}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(address)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(address._id)}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {!address.isDefault && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-4"
                                                    onClick={() => handleSetDefault(address._id)}
                                                >
                                                    Set as Default
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}

                                {addresses.length === 0 && (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                            <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                                            <Button onClick={() => setShowAddForm(true)}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Your First Address
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

