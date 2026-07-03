"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users, Package, ShoppingCart, DollarSign,
    TrendingUp, TrendingDown, BarChart3, Plus,
    Activity, Globe, Loader2, FileText, UserPlus,
    ClipboardList, ArrowRight, Zap, Megaphone, ExternalLink
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ActivityItem {
    type: 'order' | 'product' | 'user' | 'quote' | 'banner';
    id: string;
    title: string;
    subtitle: string;
    meta: string;
    status: string | null;
    createdAt: string;
    href: string;
}

interface BannerItem {
    _id: string;
    title: string;
    subtitle?: string;
    position: 'hero' | 'sidebar' | 'popup' | 'category';
    link?: string;
    isActive: boolean;
    createdAt: string;
}

interface AdminStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    monthlyRevenue: Array<{ _id: string; sales: number; count: number }>;
    recentOrders: Array<{ _id: string; user?: { email: string }; totalAmount: number; status: string; createdAt: string }>;
    topProducts?: Array<{ _id: string; totalSold: number; revenue: number }>;
    orderStatusBreakdown?: Array<{ _id: string; count: number }>;
    activities?: ActivityItem[];
    activeBanners?: BannerItem[];
    // Real stat metadata
    newUsersThisMonth?: number;
    lowStockCount?: number;
    revenueChange?: number | null;
    ordersChange?: number | null;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: '#F59E0B' },
    processing: { label: 'Processing', color: '#6366F1' },
    shipped: { label: 'Shipped', color: '#3B82F6' },
    delivered: { label: 'Delivered', color: '#10B981' },
    cancelled: { label: 'Cancelled', color: '#EF4444' },
    reviewed: { label: 'Reviewed', color: '#8B5CF6' },
    responded: { label: 'Responded', color: '#06B6D4' },
};

const ACTIVITY_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string }> = {
    order: { icon: ShoppingCart, color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
    product: { icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    user: { icon: UserPlus, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    quote: { icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    banner: { icon: Megaphone, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
};

const BANNER_POSITION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    hero: { label: 'Hero', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    sidebar: { label: 'Sidebar', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    popup: { label: 'Popup', color: 'text-violet-400', bg: 'bg-violet-500/10' },
    category: { label: 'Category', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

const DONUT_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return 'just now';
}

function buildDonutSegs(segments: { value: number; color: string }[], r = 54, circumference = 2 * Math.PI * 54) {
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    let offset = 0;
    return segments.map(seg => {
        const dash = (seg.value / total) * circumference;
        const gap = circumference - dash;
        const el = { dash, gap, offset, color: seg.color };
        offset += dash;
        return el;
    });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
    const router = useRouter();
    const { isInitialized } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
    const [activityOpen, setActivityOpen] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { if (isInitialized) loadStats(); }, [isInitialized]);

    const loadStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) { router.push('/login'); return; }
            const res = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) {
                if (res.status === 401) { router.push('/login'); throw new Error('Session expired'); }
                throw new Error((await res.json()).error || 'Failed to load');
            }
            setStats(await res.json());
        } catch (err: any) {
            toast.error(err.message || 'Update error');
        } finally {
            setLoading(false);
        }
    };

    const fmt = (n: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 })
            .format(n).replace('SAR', 'SAR ');



    if (loading) return (
        <AdminLayout title="Dashboard" onRefresh={loadStats}>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-gold/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );

    // ── Stat cards — real data ──
    const revenueChange = stats?.revenueChange ?? null;
    const ordersChange = stats?.ordersChange ?? null;
    const newUsers = stats?.newUsersThisMonth ?? 0;
    const lowStock = stats?.lowStockCount ?? 0;

    const fmtPct = (v: number | null) => v === null ? null : `${v >= 0 ? '+' : ''}${v}%`;

    const statCards = [
        {
            title: 'Total Revenue', value: fmt(stats?.totalRevenue || 0), icon: DollarSign,
            badge: fmtPct(revenueChange), positive: revenueChange === null ? true : revenueChange >= 0,
            sub: revenueChange === null ? 'No prior month data' : 'vs last month',
            color: 'text-emerald-500', bg: 'bg-emerald-500/5',
        },
        {
            title: 'Total Customers', value: stats?.totalUsers || 0, icon: Users,
            badge: newUsers > 0 ? `+${newUsers}` : null, positive: true,
            sub: newUsers > 0 ? 'new this month' : 'no new this month',
            color: 'text-indigo-500', bg: 'bg-indigo-500/5',
        },
        {
            title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart,
            badge: fmtPct(ordersChange), positive: ordersChange === null ? true : ordersChange >= 0,
            sub: ordersChange === null ? 'No prior month data' : 'vs last month',
            color: 'text-gold', bg: 'bg-gold/5',
        },
        {
            title: 'Total Products', value: stats?.totalProducts || 0, icon: Package,
            badge: lowStock > 0 ? `${lowStock} low` : null, positive: lowStock === 0,
            sub: lowStock > 0 ? 'items low on stock' : 'all items stocked',
            color: 'text-slate-400', bg: 'bg-white/5',
        },
    ];

    // ── Donut ──
    const breakdown = stats?.orderStatusBreakdown || [];
    const totalOrderCount = breakdown.reduce((s, b) => s + b.count, 0) || 1;
    const donutSegs = DONUT_STATUSES.map(s => ({
        status: s,
        value: breakdown.find(b => b._id === s)?.count || 0,
        color: STATUS_CONFIG[s]?.color || '#666',
    }));
    const activeSegs = donutSegs.filter(s => s.value > 0);
    const r = 52;
    const circumference = 2 * Math.PI * r;
    const donutPaths = buildDonutSegs(activeSegs, r, circumference);
    const hoveredSeg = hoveredStatus ? donutSegs.find(s => s.status === hoveredStatus) : null;

    // ── Activities + banners ──
    const activities = stats?.activities || [];
    const activeBanners = stats?.activeBanners || [];

    return (
        <AdminLayout title="Dashboard" description="Manage your orders, inventory, and customer data." onRefresh={loadStats}>
            <div className="space-y-6 relative z-10 pb-20">

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-[#0A1017] border border-white/[0.03] p-6 rounded-3xl hover:border-white/[0.08] transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-2xl ${card.bg}`}>
                                    <card.icon className={`w-5 h-5 ${card.color}`} />
                                </div>
                                {card.badge ? (
                                    <div className={`flex items-center gap-1 text-[10px] font-bold ${card.positive ? 'text-emerald-500' : 'text-amber-500'
                                        }`}>
                                        {card.badge}
                                        {card.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    </div>
                                ) : (
                                    <span className="text-[9px] text-slate-600 font-medium">&#8212;</span>
                                )}
                            </div>
                            <div className="mt-6">
                                <p className="text-xs font-semibold text-slate-500 mb-1">{card.title}</p>
                                <h3 className="text-2xl font-bold text-white tracking-tight">{mounted ? card.value : '---'}</h3>
                                <p className="text-[10px] text-slate-600 mt-1 font-medium">{card.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Main Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ── Left Col (8/12) ── */}
                    <div className="lg:col-span-8 space-y-4">

                        {/* Quick actions row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className="bg-[#0A1017] border border-white/[0.03] rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:border-gold/30 transition-all"
                                onClick={() => router.push('/admin/products?add=1')}
                            >
                                <div>
                                    <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">Product Inventory</p>
                                    <h4 className="text-xl font-bold text-white tracking-tight">Add New Product</h4>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-gold/5 flex items-center justify-center group-hover:bg-gold transition-colors">
                                    <Plus className="w-6 h-6 text-gold group-hover:text-navy" />
                                </div>
                            </div>
                            <div
                                className="bg-[#0A1017] border border-white/[0.03] rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-all"
                                onClick={() => router.push('/admin/analytics')}
                            >
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Analysis & Reports</p>
                                    <h4 className="text-xl font-bold text-white tracking-tight">Go to Analytics</h4>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                    <BarChart3 className="w-6 h-6 text-indigo-500 group-hover:text-white" />
                                </div>
                            </div>
                        </div>

                        {/* ── Live Banners ── */}
                        {activeBanners.length > 0 && (
                            <div className="bg-[#0A1017] border border-white/[0.03] rounded-3xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-violet-500/10">
                                            <Megaphone className="w-4 h-4 text-violet-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white tracking-tight">Live Banners</h4>
                                            <p className="text-[10px] text-slate-500 font-medium">{activeBanners.length} running now</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push('/admin/banners')}
                                        className="text-[9px] font-black text-slate-600 hover:text-gold uppercase tracking-widest transition-colors flex items-center gap-1"
                                    >
                                        Manage <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {activeBanners.map((banner) => {
                                        const pos = BANNER_POSITION_CONFIG[banner.position] || { label: banner.position, color: 'text-slate-400', bg: 'bg-white/5' };
                                        return (
                                            <div
                                                key={banner._id}
                                                onClick={() => router.push('/admin/banners')}
                                                className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.07] cursor-pointer transition-all group"
                                            >
                                                <div className="flex-shrink-0 relative">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-ping" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-bold text-white truncate">{banner.title}</p>
                                                    {banner.subtitle && (
                                                        <p className="text-[9px] text-slate-500 truncate">{banner.subtitle}</p>
                                                    )}
                                                </div>
                                                <span className={`flex-shrink-0 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${pos.bg} ${pos.color}`}>
                                                    {pos.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* ── Sidebar ── */}
                    <div className="lg:col-span-4 space-y-4">

                        {/* Store online status */}
                        <div className="bg-[#0A1017] border border-white/[0.03] rounded-3xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-400" />
                                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Store Status</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse" />
                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className={`h-1 flex-1 rounded-full ${i < 7 ? 'bg-gold/40' : 'bg-white/5'}`} />
                                ))}
                            </div>
                        </div>

                        {/* ── Order Status Donut ── */}
                        <div className="bg-[#0A1017] border border-white/[0.03] rounded-[2rem] p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <Activity className="w-4 h-4 text-gold" />
                                <h3 className="text-sm font-bold text-white tracking-tight">Order Status</h3>
                                <span className="ml-auto text-[9px] font-bold text-slate-600 uppercase tracking-widest">Breakdown</span>
                            </div>

                            {/* Ring + legend */}
                            <div className="flex items-center gap-4">
                                {/* SVG Donut */}
                                <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
                                    <svg width="120" height="120" viewBox="0 0 120 120">
                                        {/* Track */}
                                        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="13" />
                                        {/* Segments */}
                                        {activeSegs.map((seg, i) => {
                                            const p = donutPaths[i];
                                            const isHov = hoveredStatus === seg.status;
                                            return (
                                                <circle
                                                    key={seg.status}
                                                    cx="60" cy="60" r={r}
                                                    fill="none"
                                                    stroke={seg.color}
                                                    strokeWidth={isHov ? 16 : 13}
                                                    strokeDasharray={`${p.dash} ${p.gap}`}
                                                    strokeDashoffset={-p.offset + circumference * 0.25}
                                                    strokeLinecap="round"
                                                    style={{
                                                        transition: 'stroke-width 0.2s, opacity 0.2s',
                                                        opacity: hoveredStatus && !isHov ? 0.25 : 1,
                                                        cursor: 'pointer',
                                                    }}
                                                    onMouseEnter={() => setHoveredStatus(seg.status)}
                                                    onMouseLeave={() => setHoveredStatus(null)}
                                                    transform="rotate(-90 60 60)"
                                                />
                                            );
                                        })}
                                        {/* Empty ring */}
                                        {activeSegs.length === 0 && (
                                            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="13" />
                                        )}
                                    </svg>
                                    {/* Center */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <AnimatePresence mode="wait">
                                            {hoveredSeg ? (
                                                <motion.div key={hoveredSeg.status} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} className="text-center">
                                                    <p className="text-lg font-black text-white leading-none">{hoveredSeg.value}</p>
                                                    <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5" style={{ color: STATUS_CONFIG[hoveredSeg.status]?.color }}>
                                                        {STATUS_CONFIG[hoveredSeg.status]?.label}
                                                    </p>
                                                </motion.div>
                                            ) : (
                                                <motion.div key="total" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} className="text-center">
                                                    <p className="text-lg font-black text-white leading-none">{stats?.totalOrders || 0}</p>
                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex-1 space-y-2">
                                    {donutSegs.map(seg => {
                                        const cfg = STATUS_CONFIG[seg.status];
                                        const pct = Math.round((seg.value / totalOrderCount) * 100);
                                        return (
                                            <div
                                                key={seg.status}
                                                className="flex items-center justify-between cursor-pointer"
                                                onMouseEnter={() => setHoveredStatus(seg.status)}
                                                onMouseLeave={() => setHoveredStatus(null)}
                                                style={{ opacity: hoveredStatus && hoveredStatus !== seg.status ? 0.35 : 1, transition: 'opacity 0.2s' }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                                                    <span className="text-[10px] font-bold text-slate-400">{cfg.label}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[10px] font-black text-white">{seg.value}</span>
                                                    <span className="text-[9px] text-slate-600">{pct}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Mini progress bars */}
                            <div className="mt-5 space-y-2 border-t border-white/[0.04] pt-4">
                                {donutSegs.map(seg => {
                                    const cfg = STATUS_CONFIG[seg.status];
                                    const pct = Math.max(0, (seg.value / totalOrderCount) * 100);
                                    return (
                                        <div key={seg.status} className="flex items-center gap-2">
                                            <span className="text-[8px] font-bold text-slate-600 uppercase w-16 flex-shrink-0">{cfg.label}</span>
                                            <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1.0, ease: 'circOut' }}
                                                    className="h-full rounded-full"
                                                    style={{ background: cfg.color }}
                                                />
                                            </div>
                                            <span className="text-[8px] font-bold text-slate-600 w-4 text-right">{seg.value}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => router.push('/admin/orders')}
                                className="mt-4 w-full text-[9px] font-black text-slate-500 hover:text-gold uppercase tracking-widest transition-colors"
                            >
                                View All Orders →
                            </button>
                        </div>

                        {/* ── Pending Orders Action ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            onClick={() => router.push('/admin/orders?status=pending')}
                            className="bg-red-500/5 border border-red-500/10 rounded-3xl p-5 cursor-pointer hover:bg-red-500/10 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">Pending Action</span>
                                <ShoppingCart className="w-4 h-4 text-red-500/50 group-hover:text-red-400 transition-colors" />
                            </div>
                            <p className="text-2xl font-bold text-white mb-1">
                                {donutSegs.find(s => s.status === 'pending')?.value ?? 0}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">Orders awaiting processing</p>
                        </motion.div>

                        {/* ── Pending Quotes Alert ── */}
                        {(stats?.activities?.filter(a => a.type === 'quote' && a.status === 'pending').length ?? 0) > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => router.push('/admin/quotes')}
                                className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-5 cursor-pointer hover:bg-blue-500/10 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">Pending Quotes</span>
                                    <FileText className="w-4 h-4 text-blue-400/50" />
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    {stats?.activities?.filter(a => a.type === 'quote' && a.status === 'pending').length}
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium">Quote requests awaiting response</p>
                            </motion.div>
                        )}

                    </div>
                </div>
            </div>

            {/* ── Recent Activity Accordion ── */}
            <div className="bg-[#0A1017] border border-white/[0.03] rounded-[2rem] overflow-hidden">
                <button
                    onClick={() => setActivityOpen(o => !o)}
                    className="w-full flex items-center justify-between px-7 py-5 hover:bg-white/[0.02] transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gold/10">
                            <Zap className="w-4 h-4 text-gold" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-bold text-white tracking-tight">Recent Activity</h3>
                            <p className="text-[10px] text-slate-500 font-medium">Orders · Products · Users · Quotes · Banners</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {activities.length > 0 && (
                            <span className="text-[9px] font-black bg-gold/10 text-gold px-2.5 py-1 rounded-full">
                                {activities.length} events
                            </span>
                        )}
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10B981]" />
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Live</span>
                        </div>
                        <motion.div animate={{ rotate: activityOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                            <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
                        </motion.div>
                    </div>
                </button>

                <AnimatePresence initial={false}>
                    {activityOpen && (
                        <motion.div
                            key="activity-body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div className="border-t border-white/[0.04] divide-y divide-white/[0.03]">
                                {activities.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                                        <Activity className="w-7 h-7 mb-3 opacity-30" />
                                        <p className="text-sm font-bold">No activity yet</p>
                                        <p className="text-xs mt-1 opacity-60">Events will appear as your store grows</p>
                                    </div>
                                ) : (
                                    activities.map((item, idx) => {
                                        const cfg = ACTIVITY_CONFIG[item.type];
                                        const Icon = cfg.icon;
                                        const statusCfg = item.status ? STATUS_CONFIG[item.status] : null;
                                        return (
                                            <motion.div
                                                key={`${item.type}-${item.id}`}
                                                initial={{ opacity: 0, x: -6 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                onClick={() => router.push(item.href)}
                                                className="flex items-center gap-4 px-7 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                            >
                                                <div className={`w-9 h-9 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                                                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-white truncate">{item.title}</p>
                                                        {statusCfg && (
                                                            <span
                                                                className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0"
                                                                style={{ background: `${statusCfg.color}18`, color: statusCfg.color }}
                                                            >
                                                                {statusCfg.label}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 font-medium truncate">
                                                        {item.subtitle}{item.meta && <span className="text-slate-600"> · {item.meta}</span>}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <span className="text-[10px] font-bold text-slate-600">{timeAgo(item.createdAt)}</span>
                                                    <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </AdminLayout>
    );
}
