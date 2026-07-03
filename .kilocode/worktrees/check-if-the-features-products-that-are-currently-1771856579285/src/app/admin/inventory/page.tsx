"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Search,
    Package,
    AlertTriangle,
    ArrowUpDown,
    Download,
    Plus,
    Minus,
    X,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface InventoryItem {
    _id: string;
    name: string;
    sku: string;
    stock: number;
    minStock: number;
    price: number;
    category?: string;
}

export default function AdminInventoryPage() {
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
                minStock: 10,
                price: p.price,
                category: p.category
            })));
        } catch (err: any) {
            console.error('Failed to load inventory:', err);
            toast.error('Failed to load inventory');
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
                toast.error('Stock cannot go below 0');
                setAdjusting(false);
                return;
            }

            const response = await fetch(`/api/products/${adjustingItem._id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ stock: newStock })
            });

            if (!response.ok) throw new Error('Failed to update stock');

            // Update local state
            setInventory(prev =>
                prev.map(item =>
                    item._id === adjustingItem._id ? { ...item, stock: newStock } : item
                )
            );
            toast.success(`Stock adjusted: ${adjustingItem.name} → ${newStock} units`);
            setAdjustingItem(null);
            setAdjustAmount(0);
        } catch (err) {
            toast.error('Failed to adjust stock');
        } finally {
            setAdjusting(false);
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockItems = inventory.filter(item => item.stock < item.minStock);
    const outOfStockItems = inventory.filter(item => item.stock === 0);

    return (
        <AdminLayout
            title="Inventory"
            description="Manage product stock and inventory"
            onRefresh={loadInventory}
            onExport={() => {
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
                a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success('Inventory exported successfully');
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="glass border-white/10 text-white hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold font-display text-slate-300">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-gold" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-br from-white to-slate-400 text-transparent bg-clip-text font-display">{inventory.length}</div>
                    </CardContent>
                </Card>
                <Card className="glass border-white/10 text-white hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold font-display text-slate-300">Low Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-400 font-display drop-shadow-[0_0_15px_rgba(250,204,21,0.25)]">{lowStockItems.length}</div>
                    </CardContent>
                </Card>
                <Card className="glass border-white/10 text-white hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold font-display text-slate-300">Out of Stock</CardTitle>
                        <Package className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-400 font-display drop-shadow-[0_0_15px_rgba(248,113,113,0.25)]">{outOfStockItems.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search inventory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                </div>
            </div>

            {/* Inventory Table */}
            <div className="glass rounded-xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading inventory...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Product
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        SKU
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Stock
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Min Stock
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Price
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredInventory.length > 0 ? (
                                    filteredInventory.map((item) => (
                                        <tr key={item._id} className="hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-white font-medium group-hover:text-gold transition-colors font-display">{item.name}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-slate-400">{item.sku}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`font-medium font-mono ${item.stock === 0 ? 'text-red-400' : item.stock < item.minStock ? 'text-yellow-400' : 'text-white'}`}>
                                                    {item.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-slate-400 font-mono">{item.minStock}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-white font-display">${item.price?.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge className={
                                                    item.stock === 0 ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                        item.stock < item.minStock ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                            'bg-green-500/10 text-green-500 border border-green-500/20'
                                                }>
                                                    {item.stock === 0 ? 'Out of Stock' : item.stock < item.minStock ? 'Low Stock' : 'In Stock'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                                        title="Add Stock"
                                                        onClick={() => {
                                                            setAdjustingItem(item);
                                                            setAdjustAmount(10);
                                                            setAdjustReason('restock');
                                                        }}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        title="Reduce Stock"
                                                        onClick={() => {
                                                            setAdjustingItem(item);
                                                            setAdjustAmount(-1);
                                                            setAdjustReason('damaged');
                                                        }}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            No inventory items found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Stock Adjustment Modal */}
            {adjustingItem && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setAdjustingItem(null)}>
                    <div className="bg-gray-900 border border-white/10 rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white font-display">Adjust Stock</h3>
                            <Button variant="ghost" size="icon" onClick={() => setAdjustingItem(null)} className="text-slate-400 hover:text-white">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-white font-medium">{adjustingItem.name}</p>
                                <p className="text-sm text-slate-400">SKU: {adjustingItem.sku}</p>
                                <p className="text-sm text-slate-400 mt-1">
                                    Current Stock: <span className="font-mono text-white">{adjustingItem.stock}</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-300">Reason</Label>
                                <select
                                    value={adjustReason}
                                    onChange={(e) => setAdjustReason(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2"
                                >
                                    <option value="restock">Restock / New Shipment</option>
                                    <option value="return">Customer Return</option>
                                    <option value="damaged">Damaged / Write-off</option>
                                    <option value="correction">Inventory Correction</option>
                                    <option value="sold_offline">Sold Offline</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-300">Adjustment Amount</Label>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                        onClick={() => setAdjustAmount(prev => prev - 1)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={adjustAmount}
                                        onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                                        className="bg-gray-800 border-gray-700 text-white text-center font-mono w-24"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                                        onClick={() => setAdjustAmount(prev => prev + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {adjustAmount > 0 ? `Adding ${adjustAmount} units` : adjustAmount < 0 ? `Removing ${Math.abs(adjustAmount)} units` : 'No change'}
                                    → New stock: <span className={`font-mono ${(adjustingItem.stock + adjustAmount) < 0 ? 'text-red-400' : 'text-green-400'}`}>{Math.max(0, adjustingItem.stock + adjustAmount)}</span>
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setAdjustingItem(null)} className="border-gray-700 text-gray-300">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleStockAdjust}
                                    disabled={adjustAmount === 0 || adjusting || (adjustingItem.stock + adjustAmount) < 0}
                                    className="bg-gold hover:bg-gold/90 text-navy font-bold"
                                >
                                    {adjusting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowUpDown className="h-4 w-4 mr-2" />}
                                    {adjusting ? 'Updating...' : 'Adjust Stock'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
