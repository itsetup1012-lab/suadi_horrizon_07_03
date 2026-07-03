"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    BarChart3,
    Plus,
    ArrowRight,
    FileText
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { toast } from 'sonner';

interface AdminStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    monthlyRevenue: Array<{ _id: string; sales: number; count: number }>;
    recentOrders: Array<{
        _id: string;
        user?: { email: string };
        totalAmount: number;
        status: string;
        createdAt: string;
    }>;
    stripeBalance?: {
        available: number;
        pending: number;
    };
    topProducts?: Array<{
        _id: string;
        totalSold: number;
        revenue: number;
    }>;
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [overviewTab, setOverviewTab] = useState<'revenue' | 'orders'>('revenue');

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    throw new Error('Session expired');
                }
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Failed to load dashboard data');
            }
            const data = await response.json();
            setStats(data);
        } catch (err: any) {
            console.error('Failed to load admin stats:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
            toast.error(err.message || 'Failed to load dashboard data');
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

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Simple SVG Sparkline Component
    const Sparkline = ({ color = "text-gold", data = [40, 35, 50, 45, 60, 55, 70] }) => {
        const height = 30;
        const width = 100;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className={`overflow-visible ${color}`} preserveAspectRatio="none">
                <path
                    d={`M ${points}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />
                <circle cx={(width)} cy={height - ((data[data.length - 1] - min) / range) * height} r="2" fill="currentColor" />
            </svg>
        );
    };

    if (loading) {
        return (
            <AdminLayout title="Dashboard" onRefresh={loadStats}>
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="glass p-6 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="h-4 bg-white/5 rounded w-2/3 mb-2 animate-pulse"></div>
                                        <div className="h-8 bg-white/5 rounded w-1/2 animate-pulse"></div>
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout title="Dashboard" onRefresh={loadStats}>
                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-400">Error loading dashboard</h3>
                            <div className="mt-2 text-sm text-red-300/80">
                                <p>{error}</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={loadStats}
                                    className="bg-red-900/30 px-3 py-2 rounded-md text-sm font-medium text-red-300 hover:bg-red-900/50 transition-colors border border-red-900/30"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: formatNumber(stats?.totalUsers || 0),
            icon: Users,
            trend: { value: '+12%', positive: true },
            onClick: () => router.push('/admin/users'),
            sparklineData: [65, 59, 80, 81, 56, 55, 70],
            color: 'text-blue-400'
        },
        {
            title: 'Total Products',
            value: formatNumber(stats?.totalProducts || 0),
            icon: Package,
            trend: { value: '+5%', positive: true },
            onClick: () => router.push('/admin/products'),
            sparklineData: [28, 48, 40, 19, 86, 27, 50],
            color: 'text-purple-400'
        },
        {
            title: 'Total Orders',
            value: formatNumber(stats?.totalOrders || 0),
            icon: ShoppingCart,
            trend: { value: '+23%', positive: true },
            onClick: () => router.push('/admin/orders'),
            sparklineData: [18, 48, 77, 9, 100, 27, 80],
            color: 'text-gold'
        },
        {
            title: 'Stripe Balance',
            value: formatCurrency(stats?.stripeBalance?.available || 0),
            icon: DollarSign,
            trend: { value: 'Available Now', positive: true },
            onClick: () => window.open('https://dashboard.stripe.com', '_blank'),
            sparklineData: [40, 50, 45, 60, 55, 70, 75],
            color: 'text-amber-400'
        }
    ];

    const systemHealth = [
        { label: 'Database Node', status: 'Operational', color: 'bg-emerald-500' },
        { label: 'Financial Gateway', status: stats?.stripeBalance ? 'Connected' : 'Paused', color: stats?.stripeBalance ? 'bg-emerald-500' : 'bg-amber-500' },
        { label: 'Dispatch API', status: 'Optimal', color: 'bg-emerald-500' },
    ];

    const revenueData = stats?.monthlyRevenue || [];
    const maxRevenue = Math.max(...revenueData.map(m => m.sales || 0), 1);

    return (
        <AdminLayout title="Dashboard" description="Overview of your platform" onRefresh={loadStats}>
            {/* Stats Grid with Sparklines */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        onClick={card.onClick}
                        className="glass p-6 rounded-xl border border-white/10 hover:border-gold/30 transition-all cursor-pointer group hover:bg-white/5 min-w-0 relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 group-hover:border-gold/20 transition-colors">
                                    <card.icon className={`w-5 h-5 ${card.color}`} />
                                </div>
                                <span className={`text-xs font-medium py-1 px-2 rounded-full bg-white/5 ${card.trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                                    {card.trend.value}
                                </span>
                            </div>

                            <p className="text-sm text-slate-400 mb-1 font-medium">{card.title}</p>
                            <p className="text-2xl font-bold text-white font-display group-hover:text-gold transition-colors">{card.value}</p>
                        </div>

                        {/* Sparkline centered at bottom */}
                        <div className="absolute bottom-4 right-6 w-24 h-8 opacity-50 group-hover:opacity-100 transition-opacity">
                            <Sparkline color={card.color} data={card.sparklineData} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Dashboard Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Business Overview (2/3 width) */}
                <div className="lg:col-span-2 flex flex-col h-full">
                    <div className="glass rounded-xl border border-white/10 min-w-0 flex-1 flex flex-col">
                        {/* Tab Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                                {overviewTab === 'revenue' ? <BarChart3 className="w-5 h-5 text-gold" /> : <ShoppingCart className="w-5 h-5 text-gold" />}
                                Fulfillment Pipeline
                            </h3>
                            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                                <button
                                    onClick={() => setOverviewTab('revenue')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${overviewTab === 'revenue'
                                        ? 'bg-gold/20 text-gold shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Movement
                                </button>
                                <button
                                    onClick={() => setOverviewTab('orders')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${overviewTab === 'orders'
                                        ? 'bg-gold/20 text-gold shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Live Queue
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex-1">
                            {overviewTab === 'revenue' ? (
                                <div className="h-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-white font-medium">Revenue Trend</h4>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm text-slate-400">Last 6 months</span>
                                        </div>
                                    </div>

                                    {revenueData.length > 0 && (
                                        <div className="space-y-6">
                                            {revenueData.slice(-6).map((month, index) => (
                                                <div key={index} className="group">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-slate-300">
                                                            {month._id}
                                                        </span>
                                                        <div className="text-right">
                                                            <span className="block text-sm font-bold text-white">
                                                                {formatCurrency(month.sales || 0)}
                                                            </span>
                                                            <span className="text-xs text-slate-500">
                                                                {month.count || 0} orders
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-gold/50 to-gold h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,215,0,0.2)] group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] relative"
                                                            style={{
                                                                width: `${Math.max(5, ((month.sales || 0) / maxRevenue) * 100)}%`
                                                            }}
                                                        >
                                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Top Products Section */}
                                    <div className="mt-12 pt-8 border-t border-white/5">
                                        <h4 className="text-white font-medium mb-6 flex items-center gap-2">
                                            <Package className="w-4 h-4 text-gold" />
                                            Top Logistics Moving Parts
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {stats?.topProducts?.map((product, idx) => (
                                                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-all flex items-center justify-between group">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-white truncate group-hover:text-gold transition-colors">{product._id}</p>
                                                        <p className="text-xs text-slate-500 font-mono">{product.totalSold} Units Shipped</p>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <p className="text-xs font-black text-gold">{formatCurrency(product.revenue)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-white font-medium">Latest Transactions</h4>
                                        <button
                                            onClick={() => router.push('/admin/orders')}
                                            className="text-gold hover:text-gold/80 text-sm font-medium flex items-center gap-1 transition-colors"
                                        >
                                            View all <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                        <div className="space-y-3">
                                            {stats.recentOrders.slice(0, 5).map((order, index) => (
                                                <div
                                                    key={order._id || index}
                                                    className="flex items-center justify-between p-4 border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                                            order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                'bg-slate-500/10 text-slate-400'
                                                            }`}>
                                                            <ShoppingCart className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white font-display group-hover:text-gold transition-colors">
                                                                Order #{order._id?.slice(-8) || 'N/A'}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                {order.user?.email || 'Unknown User'} • {formatDate(order.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-white font-display">
                                                            {formatCurrency(order.totalAmount || 0)}
                                                        </p>
                                                        <div className="mt-1">
                                                            <StatusBadge status={order.status || 'pending'} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                <ShoppingCart className="w-8 h-8 text-slate-600" />
                                            </div>
                                            <p className="text-slate-400">No recent orders found</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Action Center (1/3 width) */}
                <div className="space-y-8">
                    {/* Quick Actions */}
                    <div className="glass rounded-xl border border-white/10 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <h3 className="text-lg font-bold text-white font-display mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gold rounded-full inline-block"></span>
                            Quick Actions
                        </h3>
                        <div className="space-y-3 relative z-10">
                            <button
                                onClick={() => router.push('/admin/products/new')}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold/30 transition-all group/btn"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center text-gold group-hover/btn:scale-110 transition-transform duration-300">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-bold text-white group-hover/btn:text-gold transition-colors">Add Product</span>
                                        <span className="text-xs text-slate-400">Create new listing</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover/btn:text-gold group-hover/btn:translate-x-1 transition-all" />
                            </button>
                            <button
                                onClick={() => router.push('/admin/orders')}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold/30 transition-all group/btn"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-center text-blue-400 group-hover/btn:scale-110 transition-transform duration-300">
                                        <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-bold text-white group-hover/btn:text-blue-400 transition-colors">Manage Orders</span>
                                        <span className="text-xs text-slate-400">Process pending</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover/btn:text-blue-400 group-hover/btn:translate-x-1 transition-all" />
                            </button>
                            <button
                                onClick={() => router.push('/admin/users')}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold/30 transition-all group/btn"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center text-purple-400 group-hover/btn:scale-110 transition-transform duration-300">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-bold text-white group-hover/btn:text-purple-400 transition-colors">View Users</span>
                                        <span className="text-xs text-slate-400">Manage customers</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover/btn:text-purple-400 group-hover/btn:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>

                    {/* Attention Needed */}
                    <div className="glass rounded-xl border border-white/10 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <h3 className="text-lg font-bold text-white font-display mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-red-500 rounded-full inline-block"></span>
                            Attention Needed
                        </h3>
                        <div className="space-y-3 relative z-10">
                            {/* Pending Orders */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/30 transition-all hover:-translate-y-1 duration-300 group cursor-pointer" onClick={() => router.push('/admin/orders?status=pending')}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-slate-300">Pending Orders</span>
                                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold text-white font-display">0</span>
                                    <span className="text-xs text-gold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                        Dispatch <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>

                            {/* Internal Procurement Notes */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 group">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-medium text-slate-300">Procurement Notes</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-3 rounded bg-black/20 border-l-2 border-blue-500">
                                        <p className="text-[10px] text-white/60 leading-relaxed italic">
                                            "Awaiting technical clearance for Order #H2KW80KL... check hydraulic specs."
                                        </p>
                                        <p className="text-[8px] text-blue-400 mt-2 font-black uppercase">LOGISTICS OFFICER - 2H AGO</p>
                                    </div>
                                </div>
                            </div>

                            {/* Low Stock */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-500/30 transition-all hover:-translate-y-1 duration-300 group cursor-pointer" onClick={() => router.push('/admin/inventory?filter=low')}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-slate-300">Low Stock</span>
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                        <Package className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold text-white font-display">0</span>
                                    <span className="text-xs text-yellow-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                        Restock <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure Status */}
                    <div className="glass rounded-xl border border-white/10 p-6 relative overflow-hidden">
                        <h3 className="text-lg font-bold text-white font-display mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-emerald-500 rounded-full inline-block"></span>
                            Logistics Infrastructure
                        </h3>
                        <div className="space-y-4">
                            {systemHealth.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`}></div>
                                        <span className="text-[10px] text-white font-black uppercase tracking-tighter">{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
