'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Grid3x3, List, Loader2, SlidersHorizontal, Settings, Search, X, ChevronLeft, ChevronRight, Package, Quote, Zap, Battery, Cpu, Gauge, Wrench, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { getProducts, Product } from '@/api/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductTableRow } from '@/components/ProductTableRow';
import { FilterSidebar, FilterState } from '@/components/FilterSidebar';
import { QuickInquiryDialog } from '@/components/QuickInquiryDialog';
import { ShimmerGrid } from '@/components/ui/shimmer';
import { RightSidebar } from '@/components/products/RightSidebar';
import { addToCart } from '@/api/cart';
import { toast } from 'sonner';
// Product Discovery System imports
import { ConfiguratorModal } from '@/components/configurator';
import { ComparisonBar, ComparisonModal } from '@/components/comparison';
import { useComparison } from '@/contexts/ComparisonContext';
import { Equipment } from '@/lib/equipment';
import equipmentDatabase from '../../../equipment-database.json';

gsap.registerPlugin(ScrollTrigger);

// Mapping between category IDs and actual product category names
const categoryIdToName: Record<string, string> = {
    'engine': 'Engine Parts',
    'hydraulics': 'Hydraulic Parts',
    'electrical': 'Electrical (ELC) Parts',
    'transmission': 'Transmission Parts',
    'undercarriage': 'Undercarriage Parts',
    'attachments': 'Attachments',
    'cooling': 'Cooling System Parts',
    'spare': 'Spare Parts',
};

import { FloatingParticles, AnimatedConnector } from "@/components/effects/SceneEffects";

export default function ProductsPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('relevance');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        brands: [],
        categories: [],
        priceRange: [0, 5000],
        search: '',
    });
    const [inquiryDialog, setInquiryDialog] = useState({
        open: false,
        productName: '',
        productId: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const gridRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 50;

    // Debounced search state
    const [searchInput, setSearchInput] = useState(filters.search);
    const [isSearching, setIsSearching] = useState(false);

    // Reduced motion preference
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Product Discovery System state
    const { comparisonProducts } = useComparison();
    const [configuratorOpen, setConfiguratorOpen] = useState(false);
    const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

    // Load products
    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            try {
                console.log('[DEBUG] Loading products from API...');
                const res = await getProducts();
                console.log('[DEBUG] Products loaded:', res.products?.length, 'total:', res.total);
                setProducts(res.products || []);
                setFilteredProducts(res.products || []);
            } catch (error) {
                console.error('[DEBUG] Failed to load products:', error);
                toast.error('Failed to load products');
            } finally {
                console.log('[DEBUG] Setting isLoading to false');
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Apply search param filters if present - prevent infinite loop
    useEffect(() => {
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const search = searchParams.get('search');
        const price = searchParams.get('price');
        const sort = searchParams.get('sort');

        // Map category ID to actual product category name
        const mappedCategory = category ? (categoryIdToName[category] || category) : '';

        // Parse brand filter
        const brandList = brand ? brand.split(',') : [];

        // Parse price range
        let priceRange: [number, number] = [0, 5000];
        if (price) {
            const [min, max] = price.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                priceRange = [min, max];
            }
        }

        // Update sort if provided
        if (sort && sort !== 'relevance') {
            setSortBy(sort);
        }

        // Apply all filters from URL - only update if different
        setFilters(prev => {
            const newFilters = {
                ...prev,
                categories: mappedCategory ? [mappedCategory] : prev.categories,
                brands: brandList.length > 0 ? brandList : prev.brands,
                search: search || prev.search,
                priceRange: priceRange[0] > 0 || priceRange[1] < 5000 ? priceRange : prev.priceRange,
            };

            // Only update if filters actually changed
            const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(prev);
            return filtersChanged ? newFilters : prev;
        });

        // Also update search input
        if (search && search !== searchInput) {
            setSearchInput(search);
        }
    }, [searchParams]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== filters.search) {
                setFilters(prev => ({ ...prev, search: searchInput }));
            }
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput, filters.search]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        setIsSearching(true);
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.brands, filters.categories, filters.priceRange, filters.search, sortBy]);

    // Sync filters to URL for shareable links - prevent infinite loop
    useEffect(() => {
        const params = new URLSearchParams();

        if (filters.categories.length > 0) {
            // Convert category names to IDs for shorter URLs
            const categoryToId: Record<string, string> = {};
            Object.entries(categoryIdToName).forEach(([id, name]) => {
                categoryToId[name] = id;
            });
            const categoryId = categoryToId[filters.categories[0]] || filters.categories[0];
            params.set('category', categoryId);
        }

        if (filters.brands.length > 0) {
            params.set('brand', filters.brands.join(','));
        }

        if (filters.search) {
            params.set('search', filters.search);
        }

        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
            params.set('price', `${filters.priceRange[0]}-${filters.priceRange[1]}`);
        }

        if (sortBy !== 'relevance') {
            params.set('sort', sortBy);
        }

        // Update URL without reload - prevent infinite loop
        const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        const currentUrl = window.location.pathname + window.location.search;
        if (newUrl !== currentUrl) {
            window.history.replaceState({}, '', newUrl);
        }
    }, [filters, sortBy]);

    // Computed filtered and sorted products
    const processedProducts = useMemo(() => {
        let filtered = [...products];

        // Apply brand filter
        if (filters.brands.length > 0) {
            filtered = filtered.filter((p) => filters.brands.includes(p.brand));
        }

        // Apply category filter
        if (filters.categories.length > 0) {
            filtered = filtered.filter((p) => filters.categories.includes(p.category));
        }

        filtered = filtered.filter(
            (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
        );

        if (filters.search) {
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    p.sku.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.reverse();
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        return filtered;
    }, [filters, sortBy, products]);

    // Paginated products
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return processedProducts.slice(startIndex, startIndex + productsPerPage);
    }, [processedProducts, currentPage, productsPerPage]);

    const totalPages = Math.ceil(processedProducts.length / productsPerPage);

    // Set filtered products for display
    useEffect(() => {
        setFilteredProducts(processedProducts);
    }, [processedProducts]);

    // GSAP Scroll Animation for Product Cards - prevent infinite loop
    const gsapInitialized = useRef(false);
    const prevProductCount = useRef(0);

    useEffect(() => {
        // Skip if still loading, no products, or prefers reduced motion
        if (isLoading || paginatedProducts.length === 0 || prefersReducedMotion) return;
        // Skip if no grid element
        if (!gridRef.current) return;
        // Skip if already initialized for current product set and count hasn't changed
        if (gsapInitialized.current && prevProductCount.current === paginatedProducts.length) return;

        gsapInitialized.current = true;
        prevProductCount.current = paginatedProducts.length;
        const cards = gridRef.current.querySelectorAll<HTMLElement>('.product-card-animated');

        const ctx = gsap.context(() => {
            gsap.fromTo(
                cards,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, gridRef);

        return () => {
            ctx.revert();
            // Don't reset gsapInitialized here to prevent re-triggering
        };
    }, [paginatedProducts, isLoading, prefersReducedMotion]);

    const handleAddToCart = (product: Product) => {
        addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            sku: product.sku,
            type: 'product',
        });

        toast.success(`${product.name} has been added to your cart`);
    };

    const handleQuickInquiry = (product: Product) => {
        setInquiryDialog({
            open: true,
            productName: product.name,
            productId: product._id,
        });
    };

    const handleClearFilters = () => {
        setFilters({
            brands: [],
            categories: [],
            priceRange: [0, 5000],
            search: '',
        });
        setSearchInput('');
        setMobileFilterOpen(false);
    };

    const removeFilter = (type: 'brand' | 'category', value: string) => {
        if (type === 'brand') {
            setFilters({ ...filters, brands: filters.brands.filter(b => b !== value) });
        } else {
            setFilters({ ...filters, categories: filters.categories.filter(c => c !== value) });
        }
    };

    const hasActiveFilters = filters.brands.length > 0 || filters.categories.length > 0 || filters.search;

    return (
        <div className="text-white pb-24 relative overflow-hidden" ref={containerRef}>
            {/* Ambient Background */}
            <FloatingParticles />

            <div className="container-premium relative z-10">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => router.push('/')} className="hover:text-gold cursor-pointer transition-colors text-slate-400 uppercase text-[10px] tracking-[0.2em] font-bold">HOME</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-slate-600" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-gold uppercase text-[10px] tracking-[0.2em] font-bold underline underline-offset-4 decoration-gold/30">PARTS CATALOG</BreadcrumbPage>
                            </BreadcrumbItem>
                            {filters.categories.length > 0 && (
                                <>
                                    <BreadcrumbSeparator className="text-slate-600" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-white/60 uppercase text-[10px] tracking-[0.2em] font-bold">{filters.categories[0]}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </motion.div>

                {/* Page Header */}
                <div className="mb-12 flex flex-col lg:flex-row gap-8 items-start justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-xl"
                    >
                        <span className="micro-label mb-4 block">OEM CERTIFIED</span>
                        <h1 className="text-5xl font-black mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                            Industrial <span className="text-gradient-gold">Parts catalog.</span>
                        </h1>
                        <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em]">
                            {isLoading ? (
                                <>Loading products...</>
                            ) : (
                                <>
                                    Displaying <span className="text-gold">{processedProducts.length}</span> high-performance components
                                </>
                            )}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-auto space-y-4"
                    >
                        {/* Search Bar */}
                        <div className="relative w-full lg:w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                            <Input
                                type="text"
                                placeholder="Search by Part Name, Number, or OEM SKU..."
                                value={searchInput}
                                onChange={handleSearchChange}
                                className="pl-12 pr-12 bg-white/5 border-white/10 text-white h-16 rounded-2xl focus:border-gold/50 focus:ring-0 placeholder:text-white/10 transition-all text-lg font-medium"
                            />
                            {searchInput && (
                                <button
                                    onClick={() => {
                                        setSearchInput('');
                                        setFilters(prev => ({ ...prev, search: '' }));
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/40" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Category Links */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-white/5" />
                        <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.5em] whitespace-nowrap">Shop by Specialized Category</h2>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {[
                            { name: 'Engine Parts', icon: Zap, color: 'text-orange-500' },
                            { name: 'Hydraulic Parts', icon: Battery, color: 'text-cyan-500' },
                            { name: 'Electrical (ELC) Parts', icon: Cpu, color: 'text-amber-500' },
                            { name: 'Transmission Parts', icon: Gauge, color: 'text-purple-500' },
                            { name: 'Undercarriage Parts', icon: Wrench, color: 'text-emerald-500' },
                            { name: 'Attachments', icon: Package, color: 'text-slate-400' },
                        ].map((cat, idx) => (
                            <motion.button
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setFilters(prev => ({ ...prev, categories: [cat.name] }))}
                                className={`card-premium group p-6 rounded-3xl border-white/5 bg-navy/40 backdrop-blur-md text-center hover:border-gold/30 transition-all duration-500 relative overflow-hidden`}
                            >
                                <div className="absolute -inset-1 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <cat.icon className={`w-8 h-8 mx-auto mb-4 ${cat.color} group-hover:scale-110 transition-transform duration-500`} />
                                <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.2em] transition-colors">{cat.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Bulk Quote Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mb-16 p-8 lg:p-12 rounded-[3rem] bg-gradient-to-br from-gold/20 via-navy-light/50 to-navy-dark border border-gold/10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <Quote className="w-64 h-64 text-gold" />
                    </div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="flex gap-8 items-start text-center lg:text-left">
                            <div className="p-4 rounded-[1.5rem] bg-gold/10 border border-gold/20 shadow-[0_0_20px_rgba(197,160,89,0.1)] hidden md:block">
                                <Quote className="w-8 h-8 text-gold" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Need a Bulk Corporate Quote?</h3>
                                <p className="text-lg text-white/50 max-w-2xl leading-relaxed">
                                    Unlock priority wholesale pricing for fleet-wide maintenance and large-scale industrial projects.
                                </p>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="btn-primary px-12 h-16 text-lg font-bold shadow-[0_10px_30px_rgba(197,160,89,0.3)]"
                            onClick={() => router.push('/bulk-quote')}
                        >
                            Request High-Volume Pricing
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 relative">
                    {/* Desktop Sidebar (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:block lg:w-72 flex-shrink-0 border-r border-white/5 pr-12 relative"
                    >
                        <div className="sticky top-32">
                            <FilterSidebar filters={filters} onFilterChange={setFilters} />
                        </div>

                        {/* Technical Footer Marker for Left Sidebar */}
                        <div className="absolute bottom-0 left-0 right-12 pt-8 border-t border-white/5 opacity-20 hidden lg:block">
                            <div className="flex justify-between items-center font-mono text-[8px] tracking-[0.3em] text-white">
                                <span>SEC: 01-FLTR</span>
                                <span>VER: 2.0.4</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile Filter Button */}
                    <div className="lg:hidden">
                        <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                            <SheetTrigger asChild>
                                <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-bold tracking-widest uppercase text-xs">
                                    <SlidersHorizontal className="w-4 h-4 mr-3 text-gold" />
                                    Advanced Filters
                                    {(filters.brands.length > 0 || filters.categories.length > 0) && (
                                        <span className="ml-3 bg-gold text-navy text-[10px] font-black px-2 py-0.5 rounded-full">
                                            {filters.brands.length + filters.categories.length}
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[85vw] bg-navy border-white/5 text-white overflow-y-auto">
                                <div className="mt-10">
                                    <FilterSidebar filters={filters} onFilterChange={setFilters} />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Active Filters Summary */}
                        {hasActiveFilters && (
                            <div className="mb-10 flex flex-wrap gap-3 items-center py-4 border-b border-white/5">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Filtered by:</span>
                                {filters.search && (
                                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 text-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-3">
                                        Search: {filters.search}
                                        <button onClick={() => { setSearchInput(''); setFilters(prev => ({ ...prev, search: '' })); }} className="hover:text-white transition-colors">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.span>
                                )}
                                {filters.brands.map(brand => (
                                    <motion.span key={brand} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 text-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-3">
                                        {brand}
                                        <button onClick={() => removeFilter('brand', brand)} className="hover:text-white transition-colors">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.span>
                                ))}
                                {filters.categories.map(cat => (
                                    <motion.span key={cat} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 text-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-3">
                                        {cat}
                                        <button onClick={() => removeFilter('category', cat)} className="hover:text-white transition-colors">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.span>
                                ))}
                                <button
                                    onClick={handleClearFilters}
                                    className="text-[10px] font-black text-red-400 hover:text-red-300 ml-auto uppercase tracking-widest underline underline-offset-4"
                                >
                                    Reset all
                                </button>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between mb-10">
                            <div className="flex gap-4">
                                <div className="bg-white/5 border border-white/5 p-1 rounded-xl flex gap-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gold text-navy shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'text-white/40 hover:text-white'}`}
                                    >
                                        <Grid3x3 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gold text-navy shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'text-white/40 hover:text-white'}`}
                                    >
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>

                                <Button
                                    onClick={() => setConfiguratorOpen(true)}
                                    className="h-[52px] px-6 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-gold/30 transition-all group font-bold"
                                >
                                    <Settings className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                                    Part Configurator
                                </Button>
                            </div>

                            <div className="w-full sm:w-64">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="h-[52px] bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:ring-0 focus:border-gold/50">
                                        <span className="text-white/40 mr-2 text-[10px] uppercase tracking-widest">Sort:</span>
                                        <SelectValue placeholder="System Default" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-navy border-white/10 text-white">
                                        <SelectItem value="relevance">RELEVANCE</SelectItem>
                                        <SelectItem value="price-low">PRICE: LOW TO HIGH</SelectItem>
                                        <SelectItem value="price-high">PRICE: HIGH TO LOW</SelectItem>
                                        <SelectItem value="newest">LATEST ARRIVALS</SelectItem>
                                        <SelectItem value="rating">HIGHEST RATING</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading ? (
                            <ShimmerGrid count={6} />
                        ) : (
                            <>
                                {paginatedProducts.length > 0 ? (
                                    viewMode === 'grid' ? (
                                        <div
                                            ref={gridRef}
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8"
                                        >
                                            {paginatedProducts.map((product, index) => (
                                                <div key={product._id} className="product-card-animated">
                                                    <ProductCard
                                                        product={product}
                                                        onAddToCart={handleAddToCart}
                                                        onQuickInquiry={handleQuickInquiry}
                                                        index={index}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <motion.div
                                            className="space-y-6"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {paginatedProducts.map((product) => (
                                                <ProductTableRow
                                                    key={product._id}
                                                    product={product}
                                                    onAddToCart={handleAddToCart}
                                                    onQuickInquiry={handleQuickInquiry}
                                                />
                                            ))}
                                        </motion.div>
                                    )
                                ) : (
                                    <motion.div
                                        className="text-center py-32 rounded-[3rem] bg-white/5 border border-dashed border-white/10"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-navy border border-white/5 mb-8 shadow-2xl relative">
                                            <Package className="w-10 h-10 text-white/20" />
                                            <div className="absolute inset-0 bg-gold/5 blur-2xl rounded-full" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Part Synchronization Failed</h3>
                                        <p className="text-white/40 max-w-sm mx-auto mb-10 leading-relaxed uppercase text-xs tracking-widest font-bold">
                                            No components found matching your technical specifications. Try broadening your parameters.
                                        </p>
                                        <Button
                                            className="btn-primary h-14 px-10 rounded-xl"
                                            onClick={handleClearFilters}
                                        >
                                            Clear Technical Filters
                                        </Button>
                                    </motion.div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-20 py-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                                            SYSTEM LOG: PAGE {currentPage} OF {totalPages} | RECORDS: {processedProducts.length}
                                        </span>

                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="h-12 w-12 rounded-xl p-0 bg-white/5 border-white/10 text-white hover:bg-gold hover:text-navy disabled:opacity-20"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </Button>

                                            <div className="flex items-center gap-2">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageNum: number;
                                                    if (totalPages <= 5) pageNum = i + 1;
                                                    else if (currentPage <= 3) pageNum = i + 1;
                                                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                                    else pageNum = currentPage - 2 + i;

                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`h-12 min-w-[48px] rounded-xl font-black text-xs transition-all ${currentPage === pageNum ? 'bg-gold text-navy shadow-[0_0_20px_rgba(197,160,89,0.3)]' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'}`}
                                                        >
                                                            {pageNum.toString().padStart(2, '0')}
                                                        </Button>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="h-12 w-12 rounded-xl p-0 bg-white/5 border-white/10 text-white hover:bg-gold hover:text-navy disabled:opacity-20"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Sidebar - Support & Utilities */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden xl:block xl:w-80 flex-shrink-0 border-l border-white/5 pl-12 relative"
                    >
                        <RightSidebar />

                        {/* Technical Footer Marker for Right Sidebar */}
                        <div className="absolute bottom-0 right-0 left-12 pt-8 border-t border-white/5 opacity-20 hidden xl:block">
                            <div className="flex justify-between items-center font-mono text-[8px] tracking-[0.3em] text-white">
                                <span>SEC: 02-ENGR</span>
                                <span>STA: ACTIVE</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Overvlay effects */}
            <ComparisonBar products={products} onCompare={() => setComparisonModalOpen(true)} />
            <ComparisonModal products={products.filter(p => comparisonProducts.includes(p._id))} isOpen={comparisonModalOpen} onClose={() => setComparisonModalOpen(false)} />
            <ConfiguratorModal isOpen={configuratorOpen} onClose={() => setConfiguratorOpen(false)} onEquipmentSelect={setSelectedEquipment} selectedEquipment={selectedEquipment} equipmentData={equipmentDatabase} />
            <QuickInquiryDialog open={inquiryDialog.open} onOpenChange={(open) => setInquiryDialog({ ...inquiryDialog, open })} productName={inquiryDialog.productName} productId={inquiryDialog.productId} />

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
        </div>
    );
}

