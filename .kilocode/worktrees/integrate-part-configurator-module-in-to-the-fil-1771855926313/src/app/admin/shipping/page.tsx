"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Truck, Save, Plus, Edit2, Trash2, Globe, X, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

interface ShippingRate {
    id: string;
    name: string;
    zone: string;
    rate: number;
    estimatedDays: string;
    isActive: boolean;
}

interface ShippingZoneSettings {
    freeShippingThreshold: number;
    defaultZone: string;
    maxPackageWeight: number;
}

export default function AdminShippingPage() {
    const [saving, setSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
    const [rateForm, setRateForm] = useState({ name: '', zone: 'Domestic', rate: 0, estimatedDays: '5-7 business days' });

    const [zoneSettings, setZoneSettings] = useState<ShippingZoneSettings>({
        freeShippingThreshold: 100,
        defaultZone: 'Domestic',
        maxPackageWeight: 50
    });

    const getHeaders = (): HeadersInit => {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    useEffect(() => {
        loadShippingData();
    }, []);

    const loadShippingData = async () => {
        try {
            setLoadingData(true);
            const response = await fetch('/api/admin/settings', { headers: getHeaders() });
            if (response.ok) {
                const data = await response.json();
                if (data.settings?.shipping_rates) {
                    setRates(data.settings.shipping_rates);
                } else {
                    // Use defaults if no saved data
                    setRates([
                        { id: '1', name: 'Standard Shipping', zone: 'Domestic', rate: 9.99, estimatedDays: '5-7 business days', isActive: true },
                        { id: '2', name: 'Express Shipping', zone: 'Domestic', rate: 19.99, estimatedDays: '2-3 business days', isActive: true },
                        { id: '3', name: 'Free Shipping', zone: 'Domestic', rate: 0, estimatedDays: '5-7 business days', isActive: false },
                    ]);
                }
                if (data.settings?.shipping_zones) {
                    setZoneSettings(prev => ({ ...prev, ...data.settings.shipping_zones }));
                }
            }
        } catch (err) {
            console.error('Error loading shipping data:', err);
        } finally {
            setLoadingData(false);
        }
    };

    const saveRates = async (updatedRates: ShippingRate[]) => {
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ section: 'shipping_rates', data: updatedRates })
            });
            if (!response.ok) throw new Error('Failed to save');
        } catch (err) {
            console.error('Error saving rates:', err);
            throw err;
        }
    };

    const handleSaveZoneSettings = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ section: 'shipping_zones', data: zoneSettings })
            });
            if (!response.ok) throw new Error('Failed to save');
            toast.success('Shipping zone settings saved');
        } catch (err) {
            toast.error('Failed to save shipping settings');
        } finally {
            setSaving(false);
        }
    };

    const toggleRate = async (id: string) => {
        const updatedRates = rates.map(rate =>
            rate.id === id ? { ...rate, isActive: !rate.isActive } : rate
        );
        setRates(updatedRates);
        try {
            await saveRates(updatedRates);
            toast.success('Shipping rate updated');
        } catch {
            toast.error('Failed to update rate');
        }
    };

    const deleteRate = async (id: string) => {
        if (!confirm('Are you sure you want to delete this shipping rate?')) return;
        const updatedRates = rates.filter(rate => rate.id !== id);
        setRates(updatedRates);
        try {
            await saveRates(updatedRates);
            toast.success('Shipping rate deleted');
        } catch {
            toast.error('Failed to delete rate');
        }
    };

    const openAddModal = () => {
        setEditingRate(null);
        setRateForm({ name: '', zone: 'Domestic', rate: 0, estimatedDays: '5-7 business days' });
        setShowAddModal(true);
    };

    const openEditModal = (rate: ShippingRate) => {
        setEditingRate(rate);
        setRateForm({ name: rate.name, zone: rate.zone, rate: rate.rate, estimatedDays: rate.estimatedDays });
        setShowAddModal(true);
    };

    const handleSubmitRate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rateForm.name) {
            toast.error('Please enter a rate name');
            return;
        }

        let updatedRates: ShippingRate[];

        if (editingRate) {
            updatedRates = rates.map(r =>
                r.id === editingRate.id ? { ...r, ...rateForm } : r
            );
        } else {
            const newRate: ShippingRate = {
                id: Date.now().toString(),
                ...rateForm,
                isActive: true
            };
            updatedRates = [...rates, newRate];
        }

        setRates(updatedRates);
        try {
            await saveRates(updatedRates);
            toast.success(editingRate ? 'Shipping rate updated' : 'Shipping rate added');
            setShowAddModal(false);
        } catch {
            toast.error('Failed to save shipping rate');
        }
    };

    return (
        <AdminLayout title="Shipping" description="Manage shipping rates and zones" onRefresh={loadShippingData}>
            {loadingData ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                    <span className="text-slate-400 ml-3">Loading shipping data...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Shipping Rates */}
                    <div className="lg:col-span-2">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Truck className="h-5 w-5 mr-2" />
                                    Shipping Rates
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Configure shipping rates for different zones
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {rates.map((rate) => (
                                        <div
                                            key={rate.id}
                                            className={`p-4 rounded-lg border transition-all ${rate.isActive ? 'bg-white/5 border-white/10' : 'bg-white/2 border-white/5 opacity-60'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                                                        <Truck className="h-5 w-5 text-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{rate.name}</p>
                                                        <p className="text-sm text-gray-400">
                                                            {rate.zone} • {rate.estimatedDays}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-white font-bold font-display">
                                                        ${rate.rate.toFixed(2)}
                                                    </span>
                                                    <Badge className={rate.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}>
                                                        {rate.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-gray-400 hover:text-white hover:bg-white/10"
                                                            title={rate.isActive ? 'Deactivate' : 'Activate'}
                                                            onClick={() => toggleRate(rate.id)}
                                                        >
                                                            {rate.isActive ? <ToggleRight className="h-4 w-4 text-green-400" /> : <ToggleLeft className="h-4 w-4" />}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-gray-400 hover:text-white hover:bg-white/10"
                                                            title="Edit"
                                                            onClick={() => openEditModal(rate)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                            title="Delete"
                                                            onClick={() => deleteRate(rate.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {rates.length === 0 && (
                                        <p className="text-slate-400 text-center py-8">No shipping rates configured</p>
                                    )}
                                </div>
                                <Button className="w-full mt-4 bg-gold hover:bg-gold/90 text-navy font-bold" onClick={openAddModal}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Shipping Rate
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Shipping Zone Settings */}
                    <div>
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Globe className="h-5 w-5 mr-2" />
                                    Shipping Zones
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Configure shipping zones
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Free Shipping Threshold ($)</Label>
                                    <Input
                                        type="number"
                                        value={zoneSettings.freeShippingThreshold}
                                        onChange={(e) => setZoneSettings({ ...zoneSettings, freeShippingThreshold: Number(e.target.value) })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <p className="text-xs text-gray-500">Orders above this amount qualify for free shipping</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Default Zone</Label>
                                    <select
                                        value={zoneSettings.defaultZone}
                                        onChange={(e) => setZoneSettings({ ...zoneSettings, defaultZone: e.target.value })}
                                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                                    >
                                        <option value="Domestic">Domestic</option>
                                        <option value="International">International</option>
                                        <option value="Both">Both</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Maximum Package Weight (kg)</Label>
                                    <Input
                                        type="number"
                                        value={zoneSettings.maxPackageWeight}
                                        onChange={(e) => setZoneSettings({ ...zoneSettings, maxPackageWeight: Number(e.target.value) })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                                <Button onClick={handleSaveZoneSettings} disabled={saving} className="w-full bg-primary hover:bg-primary/90">
                                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                    {saving ? 'Saving...' : 'Save Settings'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Add/Edit Rate Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <div className="bg-gray-900 border border-white/10 rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white font-display">
                                {editingRate ? 'Edit Shipping Rate' : 'Add Shipping Rate'}
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmitRate} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Rate Name *</Label>
                                <Input
                                    value={rateForm.name}
                                    onChange={(e) => setRateForm({ ...rateForm, name: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="e.g. Standard Shipping"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Zone</Label>
                                <select
                                    value={rateForm.zone}
                                    onChange={(e) => setRateForm({ ...rateForm, zone: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2"
                                >
                                    <option value="Domestic">Domestic</option>
                                    <option value="International">International</option>
                                    <option value="GCC">GCC</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Rate ($)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={rateForm.rate}
                                    onChange={(e) => setRateForm({ ...rateForm, rate: parseFloat(e.target.value) || 0 })}
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Estimated Delivery</Label>
                                <Input
                                    value={rateForm.estimatedDays}
                                    onChange={(e) => setRateForm({ ...rateForm, estimatedDays: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="e.g. 5-7 business days"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="border-gray-700 text-gray-300">
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-gold hover:bg-gold/90 text-navy font-bold">
                                    {editingRate ? 'Update Rate' : 'Add Rate'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
