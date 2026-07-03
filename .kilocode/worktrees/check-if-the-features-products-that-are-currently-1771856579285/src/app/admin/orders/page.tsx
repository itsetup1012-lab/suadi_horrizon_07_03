"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/admin/StatusBadge';
import {
    Search,
    Download,
    Eye,
    Truck,
    X,
    Package,
    CheckCircle,
    XCircle,
    Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
    _id: string;
    user?: { email: string; name?: string };
    items: Array<{ name: string; quantity: number; price: number; productId?: string }>;
    totalAmount: number;
    status: string;
    shippingAddress?: any;
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewOrder, setViewOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const getHeaders = (): HeadersInit => {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch('/api/orders?admin=true', { headers });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || 'Failed to load orders');
            }
            const data = await response.json();
            setOrders(data.orders || []);
        } catch (err: any) {
            console.error('Failed to load orders:', err);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to update order status');
            }

            toast.success(`Order status updated to ${newStatus}`);
            loadOrders();
            // Also refresh the viewed order if it's open
            if (viewOrder?._id === orderId) {
                setViewOrder(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to update order status');
        }
    };

    const exportOrders = () => {
        if (filteredOrders.length === 0) {
            toast.error('No orders to export');
            return;
        }

        const headers = ['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'];
        const rows = filteredOrders.map(order => [
            order._id,
            order.user?.email || 'Guest',
            order.items?.length || 0,
            order.totalAmount || 0,
            order.status,
            new Date(order.createdAt).toISOString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Orders exported successfully');
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.includes(searchTerm) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getNextStatus = (current: string): string | null => {
        const flow: Record<string, string> = {
            'pending': 'shipped',
            'shipped': 'delivered'
        };
        return flow[current] || null;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Package className="h-4 w-4" />;
            case 'shipped': return <Truck className="h-4 w-4" />;
            case 'delivered': return <CheckCircle className="h-4 w-4" />;
            case 'cancelled': return <XCircle className="h-4 w-4" />;
            default: return <Package className="h-4 w-4" />;
        }
    };

    return (
        <AdminLayout
            title="Orders"
            description="Manage customer orders"
            onRefresh={loadOrders}
        >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by order ID or customer email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <Button
                        variant="outline"
                        className="border-gray-700 text-gray-300"
                        onClick={exportOrders}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {['pending', 'shipped', 'delivered', 'cancelled'].map(status => {
                    const count = orders.filter(o => o.status === status).length;
                    const colors: Record<string, string> = {
                        pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                        shipped: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                        delivered: 'text-green-400 bg-green-500/10 border-green-500/20',
                        cancelled: 'text-red-400 bg-red-500/10 border-red-500/20'
                    };
                    return (
                        <div
                            key={status}
                            className={`glass rounded-xl border p-4 cursor-pointer transition-all hover:scale-105 ${statusFilter === status ? colors[status] : 'border-white/10'}`}
                            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {getStatusIcon(status)}
                                <span className="text-xs uppercase font-bold font-display">{status}</span>
                            </div>
                            <p className="text-2xl font-bold text-white font-display">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Orders Table */}
            <div className="glass rounded-xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading orders...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">Items</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider font-display">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-white font-mono text-sm group-hover:text-gold transition-colors">
                                                    #{order._id.slice(-8)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-white">{order.user?.email || 'Guest'}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-slate-400">{order.items?.length || 0} items</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-white font-medium font-display">
                                                    {formatCurrency(order.totalAmount || 0)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    className="bg-navy border border-white/10 text-white text-sm rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-slate-400 text-sm">
                                                    {formatDate(order.createdAt)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-slate-400 hover:text-white hover:bg-white/10"
                                                        title="View order details"
                                                        onClick={() => setViewOrder(order)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {getNextStatus(order.status) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                            title={`Mark as ${getNextStatus(order.status)}`}
                                                            onClick={() => updateOrderStatus(order._id, getNextStatus(order.status)!)}
                                                        >
                                                            <Truck className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                            title="Cancel order"
                                                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {viewOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewOrder(null)}>
                    <div className="bg-gray-900 border border-white/10 rounded-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white font-display">Order #{viewOrder._id.slice(-8)}</h3>
                            <Button variant="ghost" size="icon" onClick={() => setViewOrder(null)} className="text-slate-400 hover:text-white">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Status</p>
                                    <StatusBadge status={viewOrder.status} />
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Total</p>
                                    <span className="text-gold font-bold text-lg font-display">{formatCurrency(viewOrder.totalAmount || 0)}</span>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Customer</p>
                                    <span className="text-white text-sm">{viewOrder.user?.email || 'Guest'}</span>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Date</p>
                                    <div className="flex items-center gap-1 text-white text-sm">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(viewOrder.createdAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-xs text-slate-500 uppercase mb-3">Order Items</p>
                                <div className="space-y-3">
                                    {viewOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-gold" />
                                                <span className="text-white text-sm">{item.name || 'Product'}</span>
                                                <span className="text-slate-500 text-xs">×{item.quantity}</span>
                                            </div>
                                            <span className="text-white text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    )) || (
                                            <p className="text-slate-400 text-sm">No items</p>
                                        )}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {viewOrder.shippingAddress && (
                                <div className="bg-white/5 rounded-lg p-4">
                                    <p className="text-xs text-slate-500 uppercase mb-2">Shipping Address</p>
                                    <p className="text-white text-sm">
                                        {typeof viewOrder.shippingAddress === 'string'
                                            ? viewOrder.shippingAddress
                                            : JSON.stringify(viewOrder.shippingAddress, null, 2)
                                        }
                                    </p>
                                </div>
                            )}

                            {/* Full ID */}
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-xs text-slate-500 uppercase mb-1">Order ID</p>
                                <code className="text-gold text-xs font-mono">{viewOrder._id}</code>
                            </div>

                            {/* Quick Actions */}
                            {viewOrder.status !== 'delivered' && viewOrder.status !== 'cancelled' && (
                                <div className="flex gap-2 pt-2">
                                    {getNextStatus(viewOrder.status) && (
                                        <Button
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={() => {
                                                updateOrderStatus(viewOrder._id, getNextStatus(viewOrder.status)!);
                                            }}
                                        >
                                            <Truck className="h-4 w-4 mr-2" />
                                            Mark as {getNextStatus(viewOrder.status)}
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                        onClick={() => {
                                            updateOrderStatus(viewOrder._id, 'cancelled');
                                        }}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
