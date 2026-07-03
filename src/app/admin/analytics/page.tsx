"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    ChevronDown,
    Filter,
    Box,
    Globe,
    Zap,
    MousePointer2,
    PieChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBadge } from '@/components/admin/StatusBadge';

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
    const router = useRouter();
    const { isInitialized } = useAuth();
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30days');
    const [mounted, setMounted] = useState(false);
    const [salesData, setSalesData] = useState<SalesData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getHeaders = (): HeadersInit => {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    useEffect(() => {
        if (isInitialized) {
            loadAnalytics();
        }
    }, [period, isInitialized]);

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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'SAR',
            minimumFractionDigits: 0
        }).format(amount).replace('SAR', 'SAR ');
    };

    const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

    const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

    const LineChartSVG = ({ data, color = '#C5A059' }: { data: Array<{ label: string; value: number }>; color?: string }) => {
        if (!data || data.length < 2) return (
            <div className="h-52 flex flex-col items-center justify-center border border-dashed border-white/[0.06] rounded-2xl w-full">
                <TrendingUp className="w-8 h-8 text-white/5 mb-2" />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Not enough data</p>
            </div>
        );

        const W = 520, H = 160, PAD = { top: 12, right: 16, bottom: 28, left: 50 };
        const innerW = W - PAD.left - PAD.right;
        const innerH = H - PAD.top - PAD.bottom;
        const maxV = Math.max(...data.map(d => d.value)) || 1;
        const minV = Math.min(...data.map(d => d.value));
        const range = maxV - minV || 1;

        const px = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
        const py = (v: number) => PAD.top + innerH - ((v - minV) / range) * innerH;

        // Smooth cubic bezier path
        const pts = data.map((d, i) => ({ x: px(i), y: py(d.value) }));
        let pathD = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) {
            const cpX = (pts[i - 1].x + pts[i].x) / 2;
            pathD += ` C ${cpX} ${pts[i - 1].y}, ${cpX} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
        }
        // Area path (close at bottom)
        const areaD = pathD + ` L ${pts[pts.length - 1].x} ${PAD.top + innerH} L ${pts[0].x} ${PAD.top + innerH} Z`;

        const gradId = 'lineAreaGrad';
        const fmtVal = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(v).replace('SAR', 'SAR ');

        return (
            <div className="relative w-full select-none">
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="w-full overflow-visible"
                    onMouseLeave={() => setTooltip(null)}
                >
                    <defs>
                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                        const y = PAD.top + innerH * t;
                        const v = maxV - t * range;
                        return (
                            <g key={i}>
                                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                                <text x={PAD.left - 6} y={y + 4} textAnchor="end" className="text-[9px]" fill="rgba(255,255,255,0.2)" fontSize="9">
                                    {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Area fill */}
                    <path d={areaD} fill={`url(#${gradId})`} />

                    {/* Line */}
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                    />

                    {/* Invisible hover zones + dots */}
                    {pts.map((pt, i) => (
                        <g key={i}>
                            {/* Hover ghost column */}
                            <rect
                                x={pt.x - (innerW / (data.length - 1)) / 2}
                                y={PAD.top}
                                width={innerW / (data.length - 1)}
                                height={innerH}
                                fill="transparent"
                                onMouseEnter={() => setTooltip({ x: pt.x, y: pt.y, label: data[i].label, value: data[i].value })}
                            />
                            {/* Dot — only show hovered */}
                            {tooltip?.label === data[i].label && (
                                <>
                                    <circle cx={pt.x} cy={pt.y} r={5} fill={color} stroke="#0A1017" strokeWidth="2" />
                                    <circle cx={pt.x} cy={pt.y} r={3} fill="white" />
                                </>
                            )}
                            {/* X axis labels */}
                            <text x={pt.x} y={H - 2} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="9">
                                {data[i].label.split('-').slice(-2).join('/')}
                            </text>
                        </g>
                    ))}
                </svg>

                {/* Tooltip */}
                {tooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute pointer-events-none"
                        style={{
                            left: `${(tooltip.x / W) * 100}%`,
                            top: `${(tooltip.y / H) * 100}%`,
                            transform: 'translate(-50%, -130%)'
                        }}
                    >
                        <div className="bg-[#111921] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
                            <p className="text-[9px] text-slate-500 font-bold whitespace-nowrap">{tooltip.label}</p>
                            <p className="text-sm font-bold text-gold whitespace-nowrap">{fmtVal(tooltip.value)}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        );
    };

    return (
        <AdminLayout
            title="Analytics Dashboard"
            description="Comprehensive overview of business performance and metrics"
            onRefresh={loadAnalytics}
        >
            <div className="relative z-10">
                {/* Time Period Selection */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">Performance Summary</h2>
                    </div>

                    <div className="flex items-center gap-3 bg-white/[0.03] p-1.5 rounded-[1.5rem] border border-white/5">
                        {['7days', '30days', '90days', 'year'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${period === p
                                    ? 'bg-white text-navy font-black shadow-lg'
                                    : 'text-white/30 hover:text-white'
                                    }`}
                            >
                                {p === '7days' ? 'W1' : p === '30days' ? 'M1' : p === '90days' ? 'Q1' : 'Y1'}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/[0.06] rounded-2xl">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 border-4 border-gold/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                            <PieChart className="absolute inset-0 m-auto w-8 h-8 text-gold animate-pulse" />
                        </div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] font-display">Loading business metrics...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                    >
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatBox
                                label="Total Sales"
                                value={mounted ? formatCurrency(salesData?.summary.totalRevenue || 0) : '---'}
                                sub={`From ${salesData?.summary.totalOrders || 0} orders`}
                                icon={TrendingUp}
                                color="text-emerald-400"
                            />
                            <StatBox
                                label="Active Customers"
                                value={formatNumber(userData?.activeUsers30Days || 0)}
                                sub="Users active this month"
                                icon={Users}
                                color="text-gold"
                                isNumber
                            />
                            <StatBox
                                label="Out of Stock"
                                value={formatNumber(inventoryData?.outOfStockCount || 0)}
                                sub="Items needing restock"
                                icon={AlertTriangle}
                                color="text-red-500"
                                isNumber
                            />
                            <StatBox
                                label="Total Inventory"
                                value={mounted ? formatNumber(inventoryData?.summary.totalStock || 0) : '---'}
                                sub="Total items in warehouse"
                                icon={Box}
                                color="text-blue-400"
                                isNumber
                            />
                        </div>

                        {/* Performance Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Trend Visualization */}
                            <div className="bg-[#0A1017] border border-white/[0.03] rounded-2xl p-7 flex flex-col">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-sm font-bold text-white tracking-tight">Sales Trend</h3>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">Revenue over time</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                        <TrendingUp className="w-5 h-5 text-gold" />
                                    </div>
                                </div>
                                <div className="flex-1 min-h-[200px] pt-2">
                                    <LineChartSVG
                                        data={salesData?.salesTrend.map(d => ({ label: d._id, value: d.sales })) || []}
                                        color="#C5A059"
                                    />
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                                    <span>Real-time</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-emerald-500">Sync Active</span>
                                    </div>
                                    <span>Verified</span>
                                </div>
                            </div>

                            {/* Product Performance Rankings */}
                            <div className="bg-[#0A1017] border border-white/[0.03] rounded-2xl p-7">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">Top Products</h3>
                                        <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mt-1">Best performing products</p>
                                    </div>
                                    <div className="flex bg-white/5 p-1 rounded-xl">
                                        <button className="px-4 py-2 rounded-lg text-[9px] font-black text-white uppercase tracking-widest bg-navy border border-white/10">Revenue</button>
                                        <button className="px-4 py-2 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors">Orders</button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {(salesData?.topProducts || []).slice(0, 5).map((product, idx) => (
                                        <div key={idx} className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-gold/20 transition-all cursor-default">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center border border-white/10 group-hover:border-gold/30 transition-all">
                                                    <span className="text-xs font-black text-gold font-display">{idx + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-black text-sm tracking-tighter uppercase font-display group-hover:text-gold transition-colors">{product.name || 'Unknown Product'}</p>
                                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{product.quantity} Units Sold</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-black font-display">{formatCurrency(product.revenue)}</p>
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">+12%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!salesData?.topProducts || salesData.topProducts.length === 0) && (
                                        <div className="py-20 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                            No sales data available for this period
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Distribution & Alerts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Inventory Alerts */}
                            <div className="bg-[#0A1017] border border-white/[0.03] rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">Stock Alerts</h3>
                                    <StatusBadge status={inventoryData?.outOfStockCount === 0 ? 'active' : 'pending'} />
                                </div>
                                <div className="space-y-4">
                                    {inventoryData?.lowStockProducts.slice(0, 5).map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:border-red-500 transition-all">
                                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                                </div>
                                                <span className="text-[11px] font-black text-white/60 uppercase tracking-tighter truncate max-w-[200px]">{item.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-black text-white font-mono">{item.stock}</span>
                                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Left</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!inventoryData?.lowStockProducts || inventoryData.lowStockProducts.length === 0) && (
                                        <div className="py-12 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                            No critical inventory alerts
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Activity Summary */}
                            <div className="bg-[#0A1017] border border-white/[0.03] rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-white tracking-tight mb-6">Quick Statistics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Total Revenue', val: formatCurrency(salesData?.summary.totalRevenue || 0), color: 'text-emerald-400' },
                                        { label: 'Avg Sale', val: formatCurrency(salesData?.summary.avgOrderValue || 0), color: 'text-gold' },
                                        { label: 'Total Customers', val: formatNumber(userData?.totalUsers || 0), color: 'text-white' },
                                        { label: 'Sign-up Growth', val: (userData?.growthRate || '0') + '%', color: 'text-blue-400' }
                                    ].map((box, i) => (
                                        <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex flex-col justify-center items-center hover:bg-white/[0.05] transition-all group">
                                            <span className={`text-xl font-black font-display ${box.color} group-hover:scale-110 transition-transform`}>{box.val}</span>
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-1 text-center">{box.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </AdminLayout>
    );
}

function StatBox({ label, value, sub, icon: Icon, trend, color, isNumber = false }: any) {
    const hasData = trend && !['—', '-'].includes(trend);
    const isPositive = hasData && trend.startsWith('+');
    return (
        <div className="bg-[#0A1017] border border-white/[0.03] p-6 rounded-2xl hover:border-white/[0.08] transition-all relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-5">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    {hasData ? (
                        <div className={`flex items-center gap-1 text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-red-400'}`}>
                            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {trend}
                        </div>
                    ) : (
                        <span className="text-[9px] text-slate-600 font-medium">&mdash;</span>
                    )}
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
                    <h3 className={`font-bold text-white tracking-tight group-hover:text-gold transition-colors ${isNumber ? 'text-2xl' : 'text-xl'}`}>{value}</h3>
                    <p className="text-[10px] text-slate-600 mt-1 font-medium">{sub}</p>
                </div>
            </div>
        </div>
    );
}
