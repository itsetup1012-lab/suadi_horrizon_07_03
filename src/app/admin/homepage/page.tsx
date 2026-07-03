"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Home, Star, Eye, EyeOff, GripVertical, Save, Loader2, Search,
    Plus, Trash2, MessageSquareQuote, BarChart3, ArrowUp, ArrowDown,
    CheckCircle, X, Package, Hash, Users, Percent, Clock, RefreshCw,
    ChevronDown, ChevronUp
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    sku?: string;
}

interface Testimonial {
    _id?: string;
    quote: string;
    author: string;
    role: string;
    company: string;
    isActive: boolean;
}

interface Section {
    id: string;
    label: string;
    visible: boolean;
    order: number;
}

interface HomepageConfig {
    featuredProductIds: string[];
    featuredProductsCount: number;
    sections: Section[];
    stats: {
        yearsExperience: number;
        satisfiedClients: number;
        partsAvailable: number;
        onTimeDelivery: number;
    };
    testimonials: Testimonial[];
    heroTitle: string;
    heroSubtitle: string;
}

export default function HomepageManagerPage() {
    const router = useRouter();
    const { user, isInitialized } = useAuth();

    const [config, setConfig] = useState<HomepageConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Featured Products state
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [productSearch, setProductSearch] = useState('');
    const [productsLoading, setProductsLoading] = useState(false);
    const [showProductPicker, setShowProductPicker] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    // Active tab
    const [activeTab, setActiveTab] = useState<'featured' | 'sections' | 'stats' | 'testimonials'>('featured');

    // New testimonial form
    const [showTestimonialForm, setShowTestimonialForm] = useState(false);
    const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
        quote: '', author: '', role: '', company: '', isActive: true
    });

    const getToken = () => localStorage.getItem('accessToken');

    const loadConfig = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/homepage');
            if (!response.ok) throw new Error('Failed to load config');
            const data = await response.json();
            setConfig(data);
        } catch (error) {
            console.error('Failed to load homepage config:', error);
            toast.error('Failed to load homepage configuration');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadProducts = useCallback(async () => {
        try {
            setProductsLoading(true);
            const response = await fetch('/api/products?limit=500');
            if (!response.ok) throw new Error('Failed to load products');
            const data = await response.json();
            setAllProducts(data.products || []);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setProductsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isInitialized) {
            loadConfig();
            loadProducts();
        }
    }, [isInitialized, loadConfig, loadProducts]);

    // Resolve selected products from IDs
    useEffect(() => {
        if (config && allProducts.length > 0) {
            const resolved = config.featuredProductIds
                .map(id => allProducts.find(p => p._id === id))
                .filter(Boolean) as Product[];
            setSelectedProducts(resolved);
        }
    }, [config, allProducts]);

    const saveConfig = async () => {
        if (!config) return;
        try {
            setSaving(true);
            const token = getToken();
            const response = await fetch('/api/admin/homepage', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...config,
                    featuredProductIds: selectedProducts.map(p => p._id)
                })
            });
            if (!response.ok) throw new Error('Failed to save');
            const data = await response.json();
            setConfig(data);
            setHasChanges(false);
            toast.success('Homepage configuration saved successfully!');
        } catch (error) {
            console.error('Failed to save config:', error);
            toast.error('Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    const markChanged = () => setHasChanges(true);

    // Featured Products handlers
    const addFeaturedProduct = (product: Product) => {
        if (selectedProducts.find(p => p._id === product._id)) {
            toast.error('Product already in featured list');
            return;
        }
        setSelectedProducts(prev => [...prev, product]);
        markChanged();
    };

    const removeFeaturedProduct = (productId: string) => {
        setSelectedProducts(prev => prev.filter(p => p._id !== productId));
        markChanged();
    };

    const moveFeaturedProduct = (index: number, direction: 'up' | 'down') => {
        const newList = [...selectedProducts];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newList.length) return;
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
        setSelectedProducts(newList);
        markChanged();
    };

    // Section handlers
    const toggleSection = (sectionId: string) => {
        if (!config) return;
        const updatedSections = config.sections.map(s =>
            s.id === sectionId ? { ...s, visible: !s.visible } : s
        );
        setConfig({ ...config, sections: updatedSections });
        markChanged();
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        if (!config) return;
        const newSections = [...config.sections];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newSections.length) return;
        // Swap orders
        const tempOrder = newSections[index].order;
        newSections[index].order = newSections[newIndex].order;
        newSections[newIndex].order = tempOrder;
        // Swap positions
        [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
        setConfig({ ...config, sections: newSections });
        markChanged();
    };

    // Testimonial handlers
    const addTestimonial = () => {
        if (!config || !newTestimonial.quote || !newTestimonial.author) {
            toast.error('Quote and author are required');
            return;
        }
        setConfig({
            ...config,
            testimonials: [...config.testimonials, { ...newTestimonial }]
        });
        setNewTestimonial({ quote: '', author: '', role: '', company: '', isActive: true });
        setShowTestimonialForm(false);
        markChanged();
    };

    const removeTestimonial = (index: number) => {
        if (!config) return;
        const updated = config.testimonials.filter((_, i) => i !== index);
        setConfig({ ...config, testimonials: updated });
        markChanged();
    };

    const toggleTestimonial = (index: number) => {
        if (!config) return;
        const updated = config.testimonials.map((t, i) =>
            i === index ? { ...t, isActive: !t.isActive } : t
        );
        setConfig({ ...config, testimonials: updated });
        markChanged();
    };

    // Stats handler
    const updateStat = (key: string, value: number) => {
        if (!config) return;
        setConfig({
            ...config,
            stats: { ...config.stats, [key]: value }
        });
        markChanged();
    };

    // Filter products for picker
    const filteredProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase())
    );

    const tabs = [
        { id: 'featured' as const, label: 'Featured Products', icon: Star, count: selectedProducts.length },
        { id: 'sections' as const, label: 'Sections', icon: Eye, count: config?.sections.filter(s => s.visible).length },
        { id: 'stats' as const, label: 'Statistics', icon: BarChart3 },
        { id: 'testimonials' as const, label: 'Testimonials', icon: MessageSquareQuote, count: config?.testimonials.filter(t => t.isActive).length }
    ];

    if (loading) {
        return (
            <AdminLayout title="Homepage Manager" description="Control your homepage content and layout">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-gold/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-gold animate-spin" />
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Homepage Manager"
            description="Control your homepage content and layout"
            onRefresh={loadConfig}
            actions={
                <Button
                    onClick={saveConfig}
                    disabled={!hasChanges || saving}
                    className={`h-9 px-5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${hasChanges
                        ? 'bg-gold text-navy hover:bg-yellow shadow-lg shadow-gold/20'
                        : 'bg-white/5 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {saving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                    {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
                </Button>
            }
        >
            <div className="space-y-6 pb-20">
                {/* Unsaved changes banner */}
                <AnimatePresence>
                    {hasChanges && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-gold/10 border border-gold/20 rounded-2xl p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                                <p className="text-sm font-bold text-gold">You have unsaved changes</p>
                            </div>
                            <Button onClick={saveConfig} disabled={saving} size="sm" className="bg-gold text-navy hover:bg-yellow font-bold text-xs">
                                {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                                Save Now
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tab Navigation */}
                <div className="flex bg-[#0A1017] border border-white/[0.03] p-1.5 rounded-2xl gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex-1 justify-center ${activeTab === tab.id
                                ? 'bg-gold text-navy shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden md:inline">{tab.label}</span>
                            {tab.count !== undefined && (
                                <Badge className={`text-[8px] font-black px-1.5 py-0 h-4 ${activeTab === tab.id
                                    ? 'bg-navy/20 text-navy border-navy/30'
                                    : 'bg-white/5 text-slate-500 border-white/10'
                                    }`}>
                                    {tab.count}
                                </Badge>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {/* ========== FEATURED PRODUCTS TAB ========== */}
                    {activeTab === 'featured' && (
                        <motion.div
                            key="featured"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Product Count Setting */}
                            <div className="bg-[#0A1017] border border-white/[0.03] rounded-3xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-tight">Display Count</h3>
                                        <p className="text-xs text-slate-500 mt-1">How many featured products to show on the homepage</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {[4, 6, 8, 12].map(num => (
                                            <button
                                                key={num}
                                                onClick={() => {
                                                    if (config) {
                                                        setConfig({ ...config, featuredProductsCount: num });
                                                        markChanged();
                                                    }
                                                }}
                                                className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${config?.featuredProductsCount === num
                                                    ? 'bg-gold text-navy shadow-lg shadow-gold/20'
                                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/[0.05]'
                                                    }`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Selected Products */}
                            <div className="bg-[#0A1017] border border-white/[0.03] rounded-3xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-tight">Selected Products</h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected •
                                            Drag to reorder
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setShowProductPicker(!showProductPicker)}
                                        className="bg-gold/10 text-gold hover:bg-gold hover:text-navy transition-all font-bold text-xs border border-gold/20"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Products
                                    </Button>
                                </div>

                                {selectedProducts.length === 0 ? (
                                    <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                                        <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold">No featured products selected</p>
                                        <p className="text-xs text-slate-600 mt-1">Click "Add Products" to get started</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedProducts.map((product, index) => (
                                            <motion.div
                                                key={product._id}
                                                layout
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/20 transition-all group"
                                            >
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() => moveFeaturedProduct(index, 'up')}
                                                        disabled={index === 0}
                                                        className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 transition-all"
                                                    >
                                                        <ArrowUp className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => moveFeaturedProduct(index, 'down')}
                                                        disabled={index === selectedProducts.length - 1}
                                                        className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 transition-all"
                                                    >
                                                        <ArrowDown className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <div className="w-14 h-14 rounded-xl bg-navy border border-white/10 overflow-hidden flex-shrink-0">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-bold">SHI</div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-white truncate">{product.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{product.category}</span>
                                                        <span className="text-[10px] text-slate-600">•</span>
                                                        <span className="text-[10px] font-bold text-slate-500">SAR {product.price?.toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                <Badge className="bg-gold/10 text-gold border-gold/20 text-[8px] font-black px-2 h-5">
                                                    #{index + 1}
                                                </Badge>

                                                <button
                                                    onClick={() => removeFeaturedProduct(product._id)}
                                                    className="w-8 h-8 rounded-lg bg-red-500/5 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Picker */}
                            <AnimatePresence>
                                {showProductPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-[#0A1017] border border-gold/20 rounded-3xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-white tracking-tight">Product Catalog</h3>
                                                <button onClick={() => setShowProductPicker(false)} className="text-slate-500 hover:text-white">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="relative mb-4">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input
                                                    value={productSearch}
                                                    onChange={(e) => setProductSearch(e.target.value)}
                                                    placeholder="Search by name, SKU, or category..."
                                                    className="pl-11 bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-gold/50 focus:ring-0"
                                                />
                                            </div>

                                            <div className="max-h-[400px] overflow-y-auto space-y-1 custom-scrollbar">
                                                {productsLoading ? (
                                                    <div className="text-center py-10">
                                                        <Loader2 className="w-6 h-6 text-gold animate-spin mx-auto" />
                                                    </div>
                                                ) : filteredProducts.length === 0 ? (
                                                    <div className="text-center py-10">
                                                        <p className="text-slate-500 text-sm">No products found</p>
                                                    </div>
                                                ) : (
                                                    filteredProducts.slice(0, 50).map(product => {
                                                        const isSelected = selectedProducts.some(p => p._id === product._id);
                                                        return (
                                                            <div
                                                                key={product._id}
                                                                onClick={() => !isSelected && addFeaturedProduct(product)}
                                                                className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer ${isSelected
                                                                    ? 'bg-gold/5 border border-gold/20 opacity-60 cursor-not-allowed'
                                                                    : 'hover:bg-white/[0.03] border border-transparent'
                                                                    }`}
                                                            >
                                                                <div className="w-10 h-10 rounded-lg bg-navy border border-white/10 overflow-hidden flex-shrink-0">
                                                                    {product.image ? (
                                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-white/20 text-[8px] font-bold">SHI</div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-bold text-white truncate">{product.name}</p>
                                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{product.category} • SAR {product.price?.toLocaleString()}</p>
                                                                </div>
                                                                {isSelected ? (
                                                                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                                                                ) : (
                                                                    <Plus className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* ========== SECTIONS TAB ========== */}
                    {activeTab === 'sections' && config && (
                        <motion.div
                            key="sections"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="bg-[#0A1017] border border-white/[0.03] rounded-3xl p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-white tracking-tight">Section Visibility & Order</h3>
                                    <p className="text-xs text-slate-500 mt-1">Toggle sections on/off and reorder them</p>
                                </div>

                                <div className="space-y-2">
                                    {config.sections
                                        .sort((a, b) => a.order - b.order)
                                        .map((section, index) => (
                                            <motion.div
                                                key={section.id}
                                                layout
                                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${section.visible
                                                    ? 'bg-white/[0.02] border-white/[0.05]'
                                                    : 'bg-red-500/[0.02] border-red-500/10 opacity-60'
                                                    }`}
                                            >
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() => moveSection(index, 'up')}
                                                        disabled={index === 0}
                                                        className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 transition-all"
                                                    >
                                                        <ArrowUp className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => moveSection(index, 'down')}
                                                        disabled={index === config.sections.length - 1}
                                                        className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 transition-all"
                                                    >
                                                        <ArrowDown className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center border border-gold/10">
                                                    <Hash className="w-5 h-5 text-gold/50" />
                                                </div>

                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-white">{section.label}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Position: {index + 1}</p>
                                                </div>

                                                <Badge className={`text-[8px] font-black px-2 h-5 ${section.visible
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                    }`}>
                                                    {section.visible ? 'VISIBLE' : 'HIDDEN'}
                                                </Badge>

                                                <button
                                                    onClick={() => toggleSection(section.id)}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${section.visible
                                                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                                                        : 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'
                                                        }`}
                                                >
                                                    {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ========== STATS TAB ========== */}
                    {activeTab === 'stats' && config && (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="bg-[#0A1017] border border-white/[0.03] rounded-3xl p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-white tracking-tight">Homepage Statistics</h3>
                                    <p className="text-xs text-slate-500 mt-1">Update the numbers shown in the Stats section</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { key: 'yearsExperience', label: 'Years of Experience', icon: Clock, suffix: 'Years' },
                                        { key: 'satisfiedClients', label: 'Satisfied Clients', icon: Users, suffix: 'Clients' },
                                        { key: 'partsAvailable', label: 'Parts Available', icon: Package, suffix: 'Parts' },
                                        { key: 'onTimeDelivery', label: 'On-Time Delivery', icon: Percent, suffix: '%' }
                                    ].map(stat => (
                                        <div key={stat.key} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center border border-gold/10">
                                                    <stat.icon className="w-5 h-5 text-gold" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{stat.label}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.suffix}</p>
                                                </div>
                                            </div>
                                            <Input
                                                type="number"
                                                value={config.stats[stat.key as keyof typeof config.stats]}
                                                onChange={(e) => updateStat(stat.key, parseInt(e.target.value) || 0)}
                                                className="bg-white/5 border-white/10 text-white text-2xl font-black h-14 rounded-xl focus:border-gold/50 focus:ring-0 text-center"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ========== TESTIMONIALS TAB ========== */}
                    {activeTab === 'testimonials' && config && (
                        <motion.div
                            key="testimonials"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="bg-[#0A1017] border border-white/[0.03] rounded-3xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-tight">Customer Testimonials</h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {config.testimonials.filter(t => t.isActive).length} active of {config.testimonials.length} total
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setShowTestimonialForm(!showTestimonialForm)}
                                        className="bg-gold/10 text-gold hover:bg-gold hover:text-navy transition-all font-bold text-xs border border-gold/20"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Testimonial
                                    </Button>
                                </div>

                                {/* Add form */}
                                <AnimatePresence>
                                    {showTestimonialForm && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden mb-6"
                                        >
                                            <div className="p-6 rounded-2xl bg-gold/5 border border-gold/20 space-y-4">
                                                <Textarea
                                                    value={newTestimonial.quote}
                                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                                                    placeholder="Customer quote..."
                                                    className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-xl focus:border-gold/50 resize-none"
                                                />
                                                <div className="grid grid-cols-3 gap-3">
                                                    <Input
                                                        value={newTestimonial.author}
                                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
                                                        placeholder="Author name"
                                                        className="bg-white/5 border-white/10 text-white rounded-xl focus:border-gold/50"
                                                    />
                                                    <Input
                                                        value={newTestimonial.role}
                                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                                                        placeholder="Role/Title"
                                                        className="bg-white/5 border-white/10 text-white rounded-xl focus:border-gold/50"
                                                    />
                                                    <Input
                                                        value={newTestimonial.company}
                                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                                                        placeholder="Company"
                                                        className="bg-white/5 border-white/10 text-white rounded-xl focus:border-gold/50"
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" onClick={() => setShowTestimonialForm(false)} className="text-slate-400 hover:text-white">
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={addTestimonial} className="bg-gold text-navy hover:bg-yellow font-bold">
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Add Testimonial
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Testimonials list */}
                                <div className="space-y-3">
                                    {config.testimonials.map((testimonial, index) => (
                                        <div
                                            key={index}
                                            className={`p-5 rounded-2xl border transition-all ${testimonial.isActive
                                                ? 'bg-white/[0.02] border-white/[0.05]'
                                                : 'bg-red-500/[0.02] border-red-500/10 opacity-50'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <MessageSquareQuote className="w-6 h-6 text-gold/30 flex-shrink-0 mt-1" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white/80 italic leading-relaxed mb-3">
                                                        &ldquo;{testimonial.quote}&rdquo;
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-white">{testimonial.author}</span>
                                                        <span className="text-slate-600">•</span>
                                                        <span className="text-[10px] text-slate-500">{testimonial.role}, {testimonial.company}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => toggleTestimonial(index)}
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${testimonial.isActive
                                                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                                                            : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {testimonial.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => removeTestimonial(index)}
                                                        className="w-8 h-8 rounded-lg bg-red-500/5 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}
