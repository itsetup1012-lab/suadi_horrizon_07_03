"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from 'sonner';
import { Truck, Save, Plus, Edit2, Trash2, Globe, X, Loader2, ToggleLeft, ToggleRight, Clock, DollarSign, Package, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShippingRate { id: string; name: string; zone: string; rate: number; estimatedDays: string; isActive: boolean; }
interface ZoneSettings { freeShippingThreshold: number; defaultZone: string; maxPackageWeight: number; }

export default function AdminShippingPage() {
    const [saving, setSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
    const [rateForm, setRateForm] = useState({ name: '', zone: 'Domestic', rate: 0, estimatedDays: '5-7 business days' });
    const [zoneSettings, setZoneSettings] = useState<ZoneSettings>({ freeShippingThreshold: 500, defaultZone: 'Domestic', maxPackageWeight: 50 });

    const getHeaders = (): HeadersInit => {
        const token = localStorage.getItem('accessToken');
        return { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) };
    };

    useEffect(() => { loadShippingData(); }, []);

    const loadShippingData = async () => {
        try {
            setLoadingData(true);
            const res = await fetch('/api/admin/settings', { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                setRates(data.settings?.shipping_rates || [
                    { id: '1', name: 'Standard Shipping', zone: 'Domestic', rate: 25, estimatedDays: '5-7 business days', isActive: true },
                    { id: '2', name: 'Priority Shipping', zone: 'Domestic', rate: 65, estimatedDays: '2-3 business days', isActive: true },
                    { id: '3', name: 'GCC Express', zone: 'GCC', rate: 120, estimatedDays: '3-5 business days', isActive: true },
                    { id: '4', name: 'International Shipping', zone: 'International', rate: 250, estimatedDays: '10-15 business days', isActive: false },
                ]);
                if (data.settings?.shipping_zones) setZoneSettings(prev => ({ ...prev, ...data.settings.shipping_zones }));
            }
        } catch (err) { console.error(err); } finally { setLoadingData(false); }
    };

    const saveRates = async (updated: ShippingRate[]) => {
        const res = await fetch('/api/admin/settings', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ section: 'shipping_rates', data: updated }) });
        if (!res.ok) throw new Error('Save failed');
    };

    const handleSaveZones = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ section: 'shipping_zones', data: zoneSettings }) });
            if (!res.ok) throw new Error();
            toast.success('Shipping settings saved');
        } catch { toast.error('Save failed'); } finally { setSaving(false); }
    };

    const toggleRate = async (id: string) => {
        const updated = rates.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r);
        setRates(updated);
        try { await saveRates(updated); toast.success('Shipping method updated'); } catch { toast.error('Failed to update'); }
    };

    const deleteRate = async (id: string) => {
        if (!confirm('Are you sure you want to delete this shipping rate?')) return;
        const updated = rates.filter(r => r.id !== id);
        setRates(updated);
        try { await saveRates(updated); toast.success('Shipping rate deleted'); } catch { toast.error('Failed to delete'); }
    };

    const openAddModal = () => { setEditingRate(null); setRateForm({ name: '', zone: 'Domestic', rate: 0, estimatedDays: '5-7 business days' }); setShowModal(true); };
    const openEditModal = (r: ShippingRate) => { setEditingRate(r); setRateForm({ name: r.name, zone: r.zone, rate: r.rate, estimatedDays: r.estimatedDays }); setShowModal(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rateForm.name) { toast.error('Shipping method name required'); return; }
        const updated = editingRate
            ? rates.map(r => r.id === editingRate.id ? { ...r, ...rateForm } : r)
            : [...rates, { id: Date.now().toString(), ...rateForm, isActive: true }];
        setRates(updated);
        try { await saveRates(updated); toast.success(editingRate ? 'Shipping rate updated' : 'Shipping rate added'); setShowModal(false); } catch { toast.error('Failed to save'); }
    };

    const zoneColors: Record<string, string> = {
        'Domestic': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        'GCC': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        'International': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    };
    const inputCls = "w-full bg-white/[0.03] border border-white/10 text-white placeholder-white/20 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-gold/50 transition-all";

    return (
        <AdminLayout title="Shipping Settings" description="Manage shipping rates, zones, and delivery parameters" onRefresh={loadShippingData}>
            {loadingData ? (
                <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-[3rem]">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-gold/10 rounded-full" />
                        <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                        <Truck className="absolute inset-0 m-auto w-8 h-8 text-gold animate-pulse" />
                    </div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Loading Shipping Settings...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Active Methods', value: rates.filter(r => r.isActive).length, color: 'text-emerald-400', icon: CheckCircle2 },
                            { label: 'Inactive', value: rates.filter(r => !r.isActive).length, color: 'text-red-400', icon: XCircle },
                            { label: 'Free Threshold', value: `SAR ${zoneSettings.freeShippingThreshold}`, color: 'text-gold', icon: DollarSign },
                            { label: 'Max Weight', value: `${zoneSettings.maxPackageWeight}kg`, color: 'text-blue-400', icon: Package },
                        ].map((s, i) => (
                            <div key={i} className="glass-premium rounded-[2rem] border border-white/5 p-6 flex flex-col items-center text-center">
                                <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
                                <p className={`text-2xl font-black font-display font-mono ${s.color}`}>{s.value}</p>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Routes */}
                        <div className="lg:col-span-2 glass-premium rounded-[3rem] border border-white/5 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">Shipping Rates</h3>
                                    <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mt-1">Manage your shipping rates and methods</p>
                                </div>
                                <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-navy rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-gold/20">
                                    <Plus className="w-4 h-4" /> Add Shipping Rate
                                </button>
                            </div>
                            <div className="space-y-4">
                                {rates.map((rate, idx) => (
                                    <motion.div key={rate.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                        className={`group flex items-center justify-between p-6 rounded-3xl border transition-all ${rate.isActive ? 'bg-white/[0.03] border-white/10 hover:border-gold/30 hover:bg-white/[0.06]' : 'bg-white/[0.01] border-white/5 opacity-50'}`}>
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${rate.isActive ? 'bg-gold/10 border-gold/20' : 'bg-white/5 border-white/10'}`}>
                                                <Truck className={`w-5 h-5 ${rate.isActive ? 'text-gold' : 'text-white/20'}`} />
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-sm tracking-tighter uppercase font-display">{rate.name}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${zoneColors[rate.zone] || 'text-white/40 bg-white/5 border-white/10'}`}>{rate.zone}</span>
                                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3" />{rate.estimatedDays}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl font-black text-white font-display font-mono">SAR {rate.rate}</span>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => toggleRate(rate.id)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all">
                                                    {rate.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-white/30" />}
                                                </button>
                                                <button onClick={() => openEditModal(rate)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gold/20 flex items-center justify-center border border-white/10 hover:border-gold/30 transition-all">
                                                    <Edit2 className="w-4 h-4 text-white/40" />
                                                </button>
                                                <button onClick={() => deleteRate(rate.id)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center border border-white/10 hover:border-red-500/30 transition-all">
                                                    <Trash2 className="w-4 h-4 text-white/40" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {rates.length === 0 && <div className="py-16 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">No shipping rates added</div>}
                            </div>
                        </div>

                        {/* Zone Settings */}
                        <div className="glass-premium rounded-[3rem] border border-white/5 p-8 flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">Zone Settings</h3>
                                <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mt-1">Configure shipping by region</p>
                            </div>
                            <div className="space-y-6 flex-1">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Free Ship Threshold (SAR)</label>
                                    <input type="number" className={inputCls} value={zoneSettings.freeShippingThreshold} onChange={e => setZoneSettings({ ...zoneSettings, freeShippingThreshold: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Default Zone</label>
                                    <select value={zoneSettings.defaultZone} onChange={e => setZoneSettings({ ...zoneSettings, defaultZone: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:border-gold/50 transition-all">
                                        <option value="Domestic">Domestic</option>
                                        <option value="GCC">GCC</option>
                                        <option value="International">International</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Max Weight (kg)</label>
                                    <input type="number" className={inputCls} value={zoneSettings.maxPackageWeight} onChange={e => setZoneSettings({ ...zoneSettings, maxPackageWeight: Number(e.target.value) })} />
                                </div>
                                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Zone Coverage</p>
                                    {['Domestic', 'GCC', 'International'].map(zone => (
                                        <div key={zone} className="flex items-center justify-between">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${zoneColors[zone]}`}>{zone}</span>
                                            <span className="text-[10px] font-black text-white/30 font-mono">{rates.filter(r => r.zone === zone).length} methods</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleSaveZones} disabled={saving} className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-gold hover:bg-gold/90 text-navy rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] disabled:opacity-50 shadow-xl shadow-gold/20">
                                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Shipping Settings</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6" onClick={() => setShowModal(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-premium border border-white/10 rounded-[3rem] w-full max-w-lg p-10" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">{editingRate ? 'Edit Shipping Rate' : 'Add Shipping Rate'}</h3>
                                    <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mt-1">Set up shipping costs and delivery times</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all">
                                    <X className="w-4 h-4 text-white/40" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Shipping Method Name</label>
                                    <input value={rateForm.name} onChange={e => setRateForm({ ...rateForm, name: e.target.value })} className={inputCls} placeholder="e.g. Priority Dispatch" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Zone</label>
                                        <select value={rateForm.zone} onChange={e => setRateForm({ ...rateForm, zone: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:border-gold/50 transition-all">
                                            <option value="Domestic">Domestic</option>
                                            <option value="GCC">GCC</option>
                                            <option value="International">International</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Rate (SAR)</label>
                                        <input type="number" step="0.01" min="0" value={rateForm.rate} onChange={e => setRateForm({ ...rateForm, rate: parseFloat(e.target.value) || 0 })} className={inputCls} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Estimated Delivery Time</label>
                                    <input value={rateForm.estimatedDays} onChange={e => setRateForm({ ...rateForm, estimatedDays: e.target.value })} className={inputCls} placeholder="e.g. 5-7 business days" />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 bg-gold hover:bg-gold/90 text-navy rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg shadow-gold/20">{editingRate ? 'Save Changes' : 'Add Rate'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
