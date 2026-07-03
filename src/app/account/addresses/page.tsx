'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, MapPin, Settings, Bell, Plus, Edit, Trash2, Heart, Undo2, Save, X, Building, Phone, Mail, Globe, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getAddresses, addAddress, updateAddress, deleteAddress, Address } from '@/api/user';
import { Badge } from '@/components/ui/badge';

export default function AddressesPage() {
    const router = useRouter();
    const { isAuthenticated, user, isInitialized } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

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

    useEffect(() => {
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
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchAddresses();
    }, [isAuthenticated]);

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this address?')) {
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
        setIsSaving(true);

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
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (address: Address, e: React.MouseEvent) => {
        e.stopPropagation();
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
                        <BreadcrumbPage className="text-gold font-medium">Addresses</BreadcrumbPage>
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
                                <Button variant="ghost" className="w-full justify-start text-gold bg-white/5" onClick={() => router.push('/account/addresses')}>
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
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold font-display text-white">Shipping Addresses</h1>
                            {!showAddForm && (
                                <Button onClick={() => setShowAddForm(true)} className="bg-gold hover:bg-yellow text-navy font-bold">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Address
                                </Button>
                            )}
                        </div>

                        <AnimatePresence>
                            {showAddForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden mb-8"
                                >
                                    <Card className="glass border-white/5">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-xl font-display">{editingId ? 'Edit Address' : 'New Delivery Address'}</CardTitle>
                                                    <CardDescription className="text-slate-400">Where should we deliver your premium parts?</CardDescription>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => { setShowAddForm(false); setEditingId(null); }} className="text-slate-400 hover:text-white">
                                                    <X className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-300">Address Label</Label>
                                                        <Input
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            placeholder="e.g. Home, Office, Warehouse"
                                                            className="bg-white/5 border-white/10 text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-300">Recipient Name</Label>
                                                        <Input
                                                            value={formData.fullName}
                                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Street Address</Label>
                                                    <div className="relative">
                                                        <Navigation className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                                        <Input
                                                            value={formData.address}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            className="pl-10 bg-white/5 border-white/10 text-white"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid sm:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-300">City</Label>
                                                        <Input
                                                            value={formData.city}
                                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-300">State / Province</Label>
                                                        <Input
                                                            value={formData.state}
                                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-300">ZIP / Postcode</Label>
                                                        <Input
                                                            value={formData.zipCode}
                                                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-300">Country</Label>
                                                        <Input
                                                            value={formData.country}
                                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-300">Phone Number for Delivery</Label>
                                                        <Input
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            className="bg-white/5 border-white/10 text-white"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-3 pt-4">
                                                    <Button variant="ghost" type="button" onClick={() => { setShowAddForm(false); setEditingId(null); }} className="text-slate-300 hover:text-white">
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" disabled={isSaving} className="bg-gold hover:bg-yellow text-navy font-bold px-8">
                                                        <Save className="w-4 h-4 mr-2" />
                                                        {isSaving ? 'Saving...' : (editingId ? 'Update Address' : 'Add Address')}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid sm:grid-cols-1 gap-4">
                            {isLoading ? (
                                <div className="text-center py-12 text-slate-400">Loading your addresses...</div>
                            ) : addresses.length === 0 ? (
                                <Card className="glass border-white/5 py-12">
                                    <div className="text-center space-y-4">
                                        <MapPin className="w-12 h-12 text-slate-600 mx-auto" />
                                        <h3 className="text-xl font-display text-white">No addresses saved yet</h3>
                                        <p className="text-slate-400 max-w-sm mx-auto">Add a shipping address to speed up your checkout process.</p>
                                        <Button onClick={() => setShowAddForm(true)} className="bg-gold text-navy hover:bg-yellow">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Your First Address
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                addresses.map((addr) => (
                                    <Card key={addr._id} className={`glass border-white/5 transition-all group hover:border-gold/30 ${addr.isDefault ? 'ring-1 ring-gold/50' : ''}`}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline" className="bg-gold/10 text-gold border-gold/20 font-display uppercase tracking-wider text-[10px]">
                                                            {addr.name}
                                                        </Badge>
                                                        {addr.isDefault && (
                                                            <Badge className="bg-emerald-500/20 text-emerald-400 border-none">
                                                                Default
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-white mb-1">{addr.fullName}</h3>
                                                        <p className="text-slate-300 leading-relaxed">{addr.address}</p>
                                                        <p className="text-slate-300">{addr.city}, {addr.state} {addr.zipCode}</p>
                                                        <p className="text-slate-400 text-sm mt-2 flex items-center gap-2">
                                                            <Phone className="w-3 h-3" />
                                                            {addr.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2">
                                                    {!addr.isDefault && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleSetDefault(addr._id)}
                                                            className="text-slate-400 hover:text-gold"
                                                        >
                                                            Set as Default
                                                        </Button>
                                                    )}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => handleEdit(addr, e)}
                                                            className="text-slate-400 hover:text-gold bg-white/5"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => handleDelete(addr._id, e)}
                                                            className="text-slate-400 hover:text-red-400 bg-white/5"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
