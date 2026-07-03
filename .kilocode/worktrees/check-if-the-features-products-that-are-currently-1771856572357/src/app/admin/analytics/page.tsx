"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    ShoppingCart,
    Package,
    Loader2,
    RefreshCw,
    AlertTriangle,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SalesData {
    period: string;
    summary: {
        totalRevenue: number;
        totalOrders: number;
        avgOrderValue: number;
    };
    salesTrend: Array<{ _id: string; sales: number; orders: number }>;
    topProducts: Array<{ _id: string; name: string; quantity: number; revenue: number }>;
    categoryBreakdown: Array<{ _id: string; revenue: number; orders: number }>;
}

interface UserData {
    totalUsers: number;
    newUsers30Days: number;
    activeUsers30Days: number;
    growthRate: string;
    usersByRole: Array<{ _id: string; count: number }>;
}

interface InventoryData {
    summary: {
        totalValue: number;
        totalProducts: number;
        totalStock: number;
        avgPrice: number;
    };
    outOfStockCount: number;
    lowStockProducts: Array<{ _id: string; name: string; stock: number; sku?: string }>;
    categoryDistribution: Array<{ _id: string; count: number; totalStock: number }>;
}

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30days');
    const [salesData, setSalesData] = useState<SalesData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);

    const getHeaders = (): HeadersInit => {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    useEffect(() => {
        loadAnalytics();
    }, [period]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const headers = getHeaders();

            const [salesRes, usersRes, inventoryRes] = await Promise.allSettled([
                fetch(`/api/admin/analytics/sales?period=${period}`, { headers }),
                fetch('/api/admin/analytics/users', { headers }),
                fetch('/api/admin/analytics/inventory', { headers })
            ]);

            if (salesRes.status === 'fulfilled' && salesRes.value.ok) {
                setSalesData(await salesRes.value.json());
            }
            if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
                setUserData(await usersRes.value.json());
            }
            if (inventoryRes.status === 'fulfilled' && inventoryRes.value.ok) {
                setInventoryData(await inventoryRes.value.json());
            }
        } catch (err) {
            console.error('Failed to load analytics:', err);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const formatNumber = (num: number) =>
        new Intl.NumberFormat('en-US').format(num);

    // Simple bar chart as SVG
    const BarChartSVG = ({ data, maxVal, color }: { data: Array<{ label: string; value: number }>; maxVal: number; color: string }) => {
        if (data.length === 0) return <p className="text-slate-500 text-center py-8">No data available</p>;
        const barWidth = Math.max(8, Math.min(24, Math.floor(500 / data.length) - 4));
        const chartWidth = data.length * (barWidth + 4);

        return (
            <div className="overflow-x-auto">
                <svg width={Math.max(chartWidth, 300)} height="160" viewBox={`0 0 ${Math.max(chartWidth, 300)} 160`} className="mx-auto">
                    {data.map((d, i) => {
                        const h = maxVal > 0 ? (d.value / maxVal) * 120 : 0;
                        return (
                            <g key={i}>
                                <rect
                                    x={i * (barWidth + 4) + 2}
                                    y={130 - h}
                                    width={barWidth}
                                    height={h}
                                    fill={color}
                                    rx="2"
                                    className="opacity-80 hover:opacity-100 transition-opacity"
                                />
                                <title>{d.label}: {typeof d.value === 'number' ? d.value.toLocaleString() : d.value}</title>
                            </g>
                        );
                    })}
                    {/* X axis */}
                    <line x1="0" y1="132" x2={chartWidth} y2="132" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </svg>
            </div>
        );
    };

    return (
        <AdminLayout title="Analytics" description="View platform analytics and insights" onRefresh={loadAnalytics}>
            {/* Period Selector */}
            <div className="flex items-center gap-2 mb-8">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-400 text-sm mr-2">Period:</span>
                {['7days', '30days', '90days', 'year'].map((p) => (
                    <Button
                        key={p}
                        size="sm"
                        variant={period === p ? 'default' : 'outline'}
                        className={period === p ? 'bg-gold text-navy font-bold' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'}
                        onClick={() => setPeriod(p)}
                    >
                        {p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : p === '90days' ? '90 Days' : '1 Year'}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                    <span className="text-slate-400 ml-3">Loading analytics...</span>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="glass border-white/10 text-white hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold font-display text-slate-300">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-gold" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold bg-gradient-to-br from-white to-slate-400 text-transparent bg-clip-text font-display">
                                    {salesData ? formatCurrency(salesData.summary.totalRevenue) : '$0.00'}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    {salesData?.summary.totalOrders || 0} orders in period
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="glass border-white/10 text-white hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold font-display text-slate-300">Orders</CardTitle>
                                <ShoppingCart className="h-4 w-4 text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-400 font-display drop-shadow-[0_0_15px_rgba(96,165,250,0.25)]">
                                    {salesData ? formatNumber(salesData.summary.totalOrders) : '0'}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Avg {salesData ? formatCurrency(salesData.summary.avgOrderValue || 0) : '$0.00'} per order
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="glass border-white/10 text-white hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold font-display text-slate-300">Customers</CardTitle>
                                <Users className="h-4 w-4 text-green-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-400 font-display drop-shadow-[0_0_15px_rgba(74,222,128,0.25)]">
                                    {userData ? formatNumber(userData.totalUsers) : '0'}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    {userData ? `+${userData.newUsers30Days} new (${userData.growthRate}%)` : 'No data'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="glass border-white/10 text-white hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold font-display text-slate-300">Inventory Value</CardTitle>
                                <Package className="h-4 w-4 text-purple-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-400 font-display drop-shadow-[0_0_15px_rgba(192,132,252,0.25)]">
                                    {inventoryData ? formatCurrency(inventoryData.summary.totalValue) : '$0.00'}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    {inventoryData ? `${formatNumber(inventoryData.summary.totalProducts)} products, ${formatNumber(inventoryData.summary.totalStock)} units` : 'No data'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Sales Trend */}
                        <Card className="glass border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center font-display">
                                    <BarChart3 className="h-5 w-5 mr-2 text-gold" />
                                    Sales Trend
                                </CardTitle>
                                <CardDescription className="text-gray-400">Daily sales for selected period</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {salesData && salesData.salesTrend.length > 0 ? (
                                    <BarChartSVG
                                        data={salesData.salesTrend.map(d => ({ label: d._id, value: d.sales }))}
                                        maxVal={Math.max(...salesData.salesTrend.map(d => d.sales))}
                                        color="#D4AF37"
                                    />
                                ) : (
                                    <div className="h-40 flex items-center justify-center text-slate-500">
                                        No sales data for this period
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Top Products */}
                        <Card className="glass border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center font-display">
                                    <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                                    Top Selling Products
                                </CardTitle>
                                <CardDescription className="text-gray-400">Best performers by revenue</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {salesData && salesData.topProducts.length > 0 ? (
                                    <div className="space-y-3">
                                        {salesData.topProducts.slice(0, 5).map((product, i) => (
                                            <div key={product._id || i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-gold bg-gold/10 rounded-full w-6 h-6 flex items-center justify-center">
                                                        {i + 1}
                                                    </span>
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{product.name || 'Unknown'}</p>
                                                        <p className="text-xs text-slate-400">{product.quantity} sold</p>
                                                    </div>
                                                </div>
                                                <span className="text-white font-display font-bold text-sm">{formatCurrency(product.revenue)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-40 flex items-center justify-center text-slate-500">
                                        No product data for this period
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Category Breakdown */}
                        <Card className="glass border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white font-display text-base">Category Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {salesData && salesData.categoryBreakdown.length > 0 ? (
                                    <div className="space-y-3">
                                        {salesData.categoryBreakdown.map((cat, i) => {
                                            const maxRev = salesData.categoryBreakdown[0]?.revenue || 1;
                                            return (
                                                <div key={cat._id || i}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-slate-300">{cat._id || 'Other'}</span>
                                                        <span className="text-white font-display">{formatCurrency(cat.revenue)}</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                                                            style={{ width: `${(cat.revenue / maxRev) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-center py-6">No category data</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* User Growth */}
                        <Card className="glass border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white font-display text-base">User Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {userData ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                                <p className="text-2xl font-bold text-white font-display">{formatNumber(userData.totalUsers)}</p>
                                                <p className="text-xs text-slate-400">Total Users</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                                <p className="text-2xl font-bold text-green-400 font-display">{userData.newUsers30Days}</p>
                                                <p className="text-xs text-slate-400">New (30d)</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                                <p className="text-2xl font-bold text-blue-400 font-display">{userData.activeUsers30Days}</p>
                                                <p className="text-xs text-slate-400">Active (30d)</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                                <p className="text-2xl font-bold text-gold font-display">{userData.growthRate}%</p>
                                                <p className="text-xs text-slate-400">Growth Rate</p>
                                            </div>
                                        </div>
                                        {userData.usersByRole.length > 0 && (
                                            <div className="pt-2 border-t border-white/5">
                                                <p className="text-xs text-slate-400 mb-2">By Role</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {userData.usersByRole.map((r) => (
                                                        <Badge key={r._id} className="bg-white/5 text-slate-300 border border-white/10">
                                                            {r._id || 'user'}: {r.count}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-center py-6">No user data</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Low Stock Alerts */}
                        <Card className="glass border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white font-display text-base flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                                    Inventory Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {inventoryData ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                            <span className="text-sm text-red-400">Out of Stock</span>
                                            <span className="text-lg font-bold text-red-400 font-display">{inventoryData.outOfStockCount}</span>
                                        </div>
                                        {inventoryData.lowStockProducts.length > 0 ? (
                                            <div className="space-y-2">
                                                <p className="text-xs text-slate-400">Low Stock Items:</p>
                                                {inventoryData.lowStockProducts.slice(0, 5).map((p) => (
                                                    <div key={p._id} className="flex items-center justify-between text-sm py-1 border-b border-white/5 last:border-0">
                                                        <span className="text-slate-300 truncate max-w-[150px]">{p.name}</span>
                                                        <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                            {p.stock} left
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 text-sm text-center py-2">No low stock items</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-center py-6">No inventory data</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
