"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { toast } from 'sonner';
import {
    Save,
    Globe,
    Bell,
    Search,
    Loader2,
    ChevronRight,
    Settings,
    ToggleRight,
    CheckCircle2,
    AlertCircle,
    Zap,
    Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettingsPage() {
    const { isInitialized } = useAuth();
    const [initialLoading, setInitialLoading] = useState(true);
    const [savingSection, setSavingSection] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('seo');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [seo, setSeo] = useState({
        metaTitle: 'Saudi Horizon - Heavy Equipment Parts Supplier',
        metaDescription: 'Genuine heavy equipment parts for Caterpillar, Komatsu, Volvo, and more. Fast delivery across Saudi Arabia.',
        keywords: 'heavy equipment parts, caterpillar parts, komatsu, volvo, excavator parts, dozer parts',
        ogImage: '/images/og-image.jpg'
    });

    const [notifications, setNotifications] = useState({
        orderNotifications: true,
        lowStockAlerts: true,
        newUserRegistrations: false,
        quoteRequests: true,
        marketingEmails: false
    });

    const getHeaders = (): HeadersInit => {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    useEffect(() => {
        if (isInitialized) {
            loadSettings();
        }
    }, [isInitialized]);

    const loadSettings = async () => {
        try {
            setInitialLoading(true);
            const response = await fetch('/api/admin/settings', { headers: getHeaders() });
            if (!response.ok) throw new Error('Failed to load');
            const data = await response.json();
            const s = data.settings || {};
            if (s.seo) setSeo(prev => ({ ...prev, ...s.seo }));
            if (s.notifications) setNotifications(prev => ({ ...prev, ...s.notifications }));
        } catch (err) {
            console.error('Error loading settings:', err);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSave = async (section: string, data: any) => {
        setSavingSection(section);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ section, data })
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to save');
            }
            toast.success(`Settings for "${section}" saved successfully`);
        } catch (err: any) {
            toast.error(err.message || 'Save failed');
        } finally {
            setSavingSection(null);
        }
    };

    const tabs = [
        { id: 'seo', label: 'SEO Settings', icon: Search },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</label>
            {children}
        </div>
    );

    const inputClass = "w-full bg-white/[0.03] border border-white/10 text-white placeholder-white/20 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-gold/50 focus:bg-gold/5 transition-all font-sans backdrop-blur-sm";

    const SaveButton = ({ section, data }: { section: string; data: any }) => (
        <button
            onClick={() => handleSave(section, data)}
            disabled={savingSection === section}
            className="flex items-center gap-3 px-8 py-4 bg-gold hover:bg-gold/90 text-navy rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-gold/20"
        >
            {savingSection === section
                ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                : <><Save className="w-4 h-4" />Save Settings</>
            }
        </button>
    );

    if (initialLoading) return (
        <AdminLayout title="Settings" description="Configure store parameters">
            <div className="flex flex-col items-center justify-center py-32">
                <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-gold/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                    <Settings className="absolute inset-0 m-auto w-8 h-8 text-gold animate-pulse" />
                </div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Loading Settings...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout
            title="Settings"
            description="Manage your store's general settings and preferences"
            onRefresh={loadSettings}
        >
            <div className="relative z-10">
                {/* Systemic Status Header */}
                <div className="flex flex-wrap items-center gap-6 mb-10 p-5 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3 px-5 border-r border-white/10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Status: Online</span>
                    </div>
                    <div className="flex items-center gap-3 px-5 border-r border-white/10 hidden md:flex">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Database: Connected</span>
                    </div>
                    <div className="ml-auto flex items-center gap-4 pr-3">
                        {mounted && (
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">Last Saved: {new Date().toLocaleTimeString()}</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-10">
                    {/* Tab Rail */}
                    <div className="xl:w-72 space-y-3 flex-shrink-0">
                        <div className="px-4 mb-4">
                            <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Settings Modules</h3>
                        </div>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-left transition-all relative group overflow-hidden ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-gold/20 to-gold/5 text-gold border border-gold/20 shadow-[0_0_30px_rgba(255,215,0,0.1)]'
                                    : 'bg-white/[0.02] border border-white/5 text-white/40 hover:text-white hover:bg-white/[0.06]'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTabGlow" className="absolute inset-0 bg-gold/5 opacity-50 blur-xl" />
                                )}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-navy/40 border border-gold/30' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                    <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-gold fill-gold/20' : ''}`} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                                    {activeTab === tab.id && <span className="text-[8px] font-medium text-gold/60 uppercase tracking-widest mt-0.5">Selected</span>}
                                </div>
                                <ChevronRight className={`w-4 h-4 ml-auto transition-all ${activeTab === tab.id ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Content Panel */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="glass-premium rounded-[3.5rem] border border-white/5 p-12 relative overflow-hidden"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                                {activeTab === 'seo' && (
                                    <div className="space-y-10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
                                            <div>
                                                <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight">SEO Settings</h2>
                                                <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mt-2">Search Engine Optimization</p>
                                            </div>
                                            <SaveButton section="seo" data={seo} />
                                        </div>
                                        <div className="grid grid-cols-1 gap-10">
                                            <FieldRow label={`Meta Title (${seo.metaTitle.length}/60)`}>
                                                <input className={inputClass} value={seo.metaTitle} onChange={e => setSeo({ ...seo, metaTitle: e.target.value })} />
                                                <div className="h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden border border-white/5">
                                                    <div className="h-full bg-gradient-to-r from-gold/50 to-gold rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,215,0,0.3)]" style={{ width: `${Math.min((seo.metaTitle.length / 60) * 100, 100)}%` }} />
                                                </div>
                                            </FieldRow>
                                            <FieldRow label={`Meta Description (${seo.metaDescription.length}/160)`}>
                                                <textarea className={`${inputClass} resize-none`} rows={4} value={seo.metaDescription} onChange={e => setSeo({ ...seo, metaDescription: e.target.value })} />
                                                <div className="h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden border border-white/5">
                                                    <div className="h-full bg-gradient-to-r from-emerald-500/50 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.3)]" style={{ width: `${Math.min((seo.metaDescription.length / 160) * 100, 100)}%` }} />
                                                </div>
                                            </FieldRow>
                                            <FieldRow label="Keywords (Comma Separated)">
                                                <input className={inputClass} value={seo.keywords} onChange={e => setSeo({ ...seo, keywords: e.target.value })} placeholder="keyword1, keyword2, ..." />
                                            </FieldRow>
                                            <FieldRow label="Social Share Image (OG Image)">
                                                <div className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group/og">
                                                    <input className={`${inputClass} flex-1`} value={seo.ogImage} onChange={e => setSeo({ ...seo, ogImage: e.target.value })} placeholder="https://..." />
                                                    <div className="w-20 h-14 rounded-xl bg-navy/40 border border-white/10 overflow-hidden flex-shrink-0 relative group-hover/og:border-gold/30 transition-all">
                                                        {seo.ogImage ? <img src={seo.ogImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Globe className="w-5 h-5 text-white/10" /></div>}
                                                    </div>
                                                </div>
                                            </FieldRow>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="space-y-10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
                                            <div>
                                                <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight">Notifications</h2>
                                                <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mt-2">Admin Alerts and Emails</p>
                                            </div>
                                            <SaveButton section="notifications" data={notifications} />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {([
                                                { key: 'orderNotifications', label: 'Order Notifications', desc: 'Receive alerts for new customer orders', icon: Zap },
                                                { key: 'lowStockAlerts', label: 'Inventory Alerts', desc: 'Notify when products are low on stock', icon: AlertCircle },
                                                { key: 'newUserRegistrations', label: 'New User Alerts', desc: 'Alert when a new user registers', icon: ToggleRight },
                                                { key: 'quoteRequests', label: 'Quote Requests', desc: 'Notify on new quote requests', icon: CheckCircle2 },
                                                { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Enable promotional email campaigns', icon: Globe },
                                            ] as const).map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group overflow-hidden relative">
                                                    <div className="flex items-center gap-6 relative z-10">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${notifications[item.key] ? 'bg-gold/10 border border-gold/30' : 'bg-white/5 border border-white/10'}`}>
                                                            <item.icon className={`w-5 h-5 ${notifications[item.key] ? 'text-gold' : 'text-white/20'}`} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-gold transition-colors">{item.label}</p>
                                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                                        className={`relative w-16 h-8 rounded-full transition-all peer z-10 ${notifications[item.key] ? 'bg-gold shadow-[0_0_20px_rgba(255,215,0,0.3)]' : 'bg-white/10'}`}
                                                    >
                                                        <span className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-white transition-all shadow-md ${notifications[item.key] ? 'translate-x-8' : 'translate-x-0'}`} />
                                                    </button>
                                                    {notifications[item.key] && <div className="absolute inset-0 bg-gold/5 blur-2xl pointer-events-none" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
