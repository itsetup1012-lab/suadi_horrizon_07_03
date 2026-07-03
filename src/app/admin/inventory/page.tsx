"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Package,
    AlertTriangle,
    ArrowUpDown,
    Download,
    Plus,
    Minus,
    X,
    Loader2,
    BarChart3,
    Activity,
    Box,
    RefreshCw,
    Filter,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    History
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface InventoryItem {
    _id: string;
    name: string;
    sku: string;
    stock: number;
    minStock: number;
    price: number;
    category?: string;
    brand?: string;
}

export default function AdminInventoryPage() {
    const router = useRouter();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
    const [adjustAmount, setAdjustAmount] = useState(0);
    const [adjustReason, setAdjustReason] = useState('restock');
    const [adjusting, setAdjusting] = useState(false);

    const getHeaders = (): HeadersInit => {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/products?limit=1000', { headers: getHeaders() });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || 'Failed to load inventory');
            }
            const data = await response.json();
            const products = data.products || [];

            setInventory(products.map((p: any) => ({
                _id: p._id,
                name: p.name,
                sku: p.sku,
                stock: p.stock || 0,
                minStock: 10, // Default threshold
                price: p.price,
                category: p.category,
                brand: p.brand
            })));
        } catch (err: any) {
            console.error('Failed to load inventory:', err);
            toast.error('Failed to sync with product database');
        } finally {
            setLoading(false);
        }
    };

    const handleStockAdjust = async () => {
        if (!adjustingItem || adjustAmount === 0) return;

        setAdjusting(true);
        try {
            const newStock = adjustingItem.stock + adjustAmount;
            if (newStock < 0) {
                toast.error('Error: Stock cannot be negative');
                setAdjusting(false);
                return;
            }

            const response = await fetch(`/api/products/${adjustingItem._id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ stock: newStock })
            });

            if (!response.ok) throw new Error('Failed to update stock');

            setInventory(prev =>
                prev.map(item =>
                    item._id === adjustingItem._id ? { ...item, stock: newStock } : item
                )
            );
            toast.success(`Stock Updated: ${adjustingItem.sku} now at ${newStock} units`);
            setAdjustingItem(null);
            setAdjustAmount(0);
        } catch (err) {
            toast.error('Failed to save stock adjustment');
        } finally {
            setAdjusting(false);
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'SAR',
            minimumFractionDigits: 0
        }).format(amount).replace('SAR', 'SAR ');
    };

    const stats = {
        totalItems: inventory.length,
        totalStock: inventory.reduce((acc, curr) => acc + curr.stock, 0),
        lowStock: inventory.filter(item => item.stock > 0 && item.stock < item.minStock).length,
        outOfStock: inventory.filter(item => item.stock === 0).length,
        totalValue: inventory.reduce((acc, curr) => acc + (curr.price * curr.stock), 0)
    };

    return (
        <AdminLayout
            title="Inventory Management"
            description="Monitor and manage stock levels"
            onRefresh={loadInventory}
        >
            <div className="relative z-10">
                {/* Visual Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Items', value: stats.totalItems, icon: Box, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { label: 'Inventory Value', value: formatCurrency(stats.totalValue), icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { label: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', glow: stats.lowStock > 0 },
                        { label: 'Out of Stock', value: stats.outOfStock, icon: Package, color: 'text-red-400', bg: 'bg-red-500/10', glow: stats.outOfStock > 0 }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`bg-[#0A1017] border border-white/[0.03] p-5 rounded-2xl relative overflow-hidden group hover:border-white/[0.08] transition-all`}
                        >
                            <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} rounded-full blur-2xl -mr-8 -mt-8 opacity-50`} />
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center border border-white/10 group-hover:border-${stat.color.split('-')[1]}/30 transition-all`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color} ${stat.glow ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Live Status</div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-black text-white font-display tracking-tight group-hover:text-gold transition-colors">{stat.value}</h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Control Center */}
                <div className="bg-[#0A1017] border border-white/[0.03] rounded-2xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative flex-1 max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search inventory by name, SKU or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder:text-white/20 focus:border-gold/30 focus:ring-1 focus:ring-gold/30 outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                className="glass-premium rounded-2xl border-white/5 text-slate-400 hover:text-white"
                                onClick={() => {
                                    const csv = [
                                        ['Name', 'SKU', 'Stock', 'Min Stock', 'Price', 'Category', 'Status'].join(','),
                                        ...filteredInventory.map(i => [
                                            `"${i.name}"`, i.sku, i.stock, i.minStock, i.price,
                                            `"${i.category || ''}"`,
                                            i.stock === 0 ? 'Out of Stock' : i.stock < i.minStock ? 'Low Stock' : 'In Stock'
                                        ].join(','))
                                    ].join('\n');
                                    const blob = new Blob([csv], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `SAUDI-HORIZON-INVENTORY-${new Date().toISOString().split('T')[0]}.csv`;
                                    a.click();
                                    toast.success('Inventory report exported');
                                }}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export Inventory
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Inventory Matrix Table */}
                <div className="bg-[#0A1017] border border-white/[0.03] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-white/[0.02]">
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5">Product</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5">SKU</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5 text-center">Stock</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5">Price</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5">Status</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Loading inventory...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredInventory.length > 0 ? (
                                    filteredInventory.map((item, idx) => (
                                        <tr
                                            key={item._id}
                                            className="group hover:bg-white/[0.03] transition-all cursor-default"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-navy border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-all">
                                                        <Box className="w-6 h-6 text-white/20 group-hover:text-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-black text-sm tracking-tight font-display uppercase group-hover:text-gold transition-colors">{item.name}</p>
                                                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{item.category || 'Product'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <code className="text-[11px] text-white/40 bg-white/5 px-2 py-1 rounded font-mono group-hover:text-gold/60 transition-colors uppercase tracking-widest">
                                                    {item.sku || 'No SKU'}
                                                </code>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className={`text-xl font-black font-display font-mono ${item.stock === 0 ? 'text-red-500' :
                                                        item.stock < item.minStock ? 'text-amber-400' : 'text-white'
                                                        }`}>
                                                        {item.stock}
                                                    </span>
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Units Available</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-white font-display">{formatCurrency(item.price)}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <StatusBadge status={
                                                    item.stock === 0 ? 'cancelled' :
                                                        item.stock < item.minStock ? 'pending' : 'active'
                                                } />
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setAdjustingItem(item);
                                                            setAdjustAmount(1);
                                                            setAdjustReason('restock');
                                                        }}
                                                        className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-navy hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setAdjustingItem(item);
                                                            setAdjustAmount(-1);
                                                            setAdjustReason('damaged');
                                                        }}
                                                        className="w-10 h-10 rounded-xl bg-red-400/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-navy hover:shadow-lg hover:shadow-red-500/20 transition-all"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setAdjustingItem(item)}
                                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 hover:bg-white/10 transition-all"
                                                    >
                                                        <History className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Package className="w-12 h-12 text-white/5" />
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">No products found matching your search</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Premium Adjustment Modal */}
            <AnimatePresence>
                {adjustingItem && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-navy/80 backdrop-blur-xl"
                            onClick={() => setAdjustingItem(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg glass-premium rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-32 -mt-32" />
                            <div className="p-10 relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">Stock Adjustment</h3>
                                        <p className="text-gold text-[10px] font-black uppercase tracking-[0.2em] mt-1">Update product quantity</p>
                                    </div>
                                    <button onClick={() => setAdjustingItem(null)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-navy border border-gold/20 flex items-center justify-center">
                                                <Box className="w-6 h-6 text-gold" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black uppercase font-display tracking-tight">{adjustingItem.name}</p>
                                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{adjustingItem.sku}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Current Stock</span>
                                            <span className="text-xl font-black text-white font-display">{adjustingItem.stock} UNITS</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Reason for Change</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['restock', 'correction', 'damaged', 'sold_offline'].map((reason) => (
                                                <button
                                                    key={reason}
                                                    onClick={() => setAdjustReason(reason)}
                                                    className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${adjustReason === reason
                                                        ? 'bg-gold text-navy border-gold shadow-lg shadow-gold/20'
                                                        : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                                                        }`}
                                                >
                                                    {reason.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Quantity Change</Label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setAdjustAmount(prev => prev - 1)}
                                                className="w-14 h-14 rounded-2xl bg-red-400/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-400 hover:text-navy transition-all"
                                            >
                                                <Minus className="w-6 h-6 font-black" />
                                            </button>
                                            <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl h-14 flex items-center justify-center">
                                                <span className={`text-2xl font-black font-display ${adjustAmount > 0 ? 'text-emerald-400' : adjustAmount < 0 ? 'text-red-400' : 'text-white'}`}>
                                                    {adjustAmount > 0 ? '+' : ''}{adjustAmount}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setAdjustAmount(prev => prev + 1)}
                                                className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-400 hover:text-navy transition-all"
                                            >
                                                <Plus className="w-6 h-6 font-black" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">New Quantity</span>
                                            <span className="text-[9px] font-black text-gold uppercase tracking-widest">
                                                {adjustingItem.stock} → {Math.max(0, adjustingItem.stock + adjustAmount)} UNITS
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Button
                                            onClick={() => setAdjustingItem(null)}
                                            variant="outline"
                                            className="flex-1 rounded-2xl py-6 border-white/10 text-white/40 hover:text-white"
                                        >
                                            CANCEL
                                        </Button>
                                        <Button
                                            onClick={handleStockAdjust}
                                            disabled={adjustAmount === 0 || adjusting || (adjustingItem.stock + adjustAmount) < 0}
                                            className="flex-1 bg-gold hover:bg-gold/90 text-navy font-black rounded-2xl py-6 shadow-xl shadow-gold/20"
                                        >
                                            {adjusting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SAVE CHANGES'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
