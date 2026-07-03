'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, ChevronRight, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { getProducts, Product } from '@/api/products';
import { addToCart } from '@/api/cart';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function WishlistPage() {
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Redirect if not authenticated
    React.useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account/wishlist');
        }
    }, [isAuthenticated, isInitialized, router]);

    // Fetch products that are in wishlist
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProducts({ limit: 1000 });
                setProducts(res.products.filter(p => wishlistItems.includes(p._id)));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (wishlistItems.length > 0) {
            fetchProducts();
        } else {
            setIsLoading(false);
        }
    }, [wishlistItems]);

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
        removeFromWishlist(product._id);
        toast.success(`${product.name} added to cart`);
    };

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-navy text-white py-8 relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList className="text-slate-400">
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')} className="hover:text-gold transition-colors">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-600" />
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/account')} className="hover:text-gold transition-colors">Account</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-600" />
                        <BreadcrumbPage className="text-gold font-medium">Wishlist</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-display">My Wishlist</h1>
                        <p className="text-slate-400 mt-1">
                            {products.length} {products.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                    {products.length > 0 && (
                        <Button
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                            onClick={() => {
                                clearWishlist();
                                toast.success('Wishlist cleared');
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear All
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {products.map((product) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="glass border-white/5 hover:border-gold/30 transition-all overflow-hidden group">
                                        <CardContent className="p-0">
                                            <div className="flex">
                                                {/* Product Image */}
                                                <div className="w-32 h-32 bg-white/5 relative flex-shrink-0">
                                                    <img
                                                        src={product.image || '/placeholder-image.png'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        onClick={() => removeFromWishlist(product._id)}
                                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 p-4 flex flex-col justify-between">
                                                    <div>
                                                        <p className="text-xs text-gold/80 uppercase tracking-wider font-medium">
                                                            {product.brand}
                                                        </p>
                                                        <h3 className="font-semibold text-white line-clamp-2 mt-1 group-hover:text-gold transition-colors">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-400 line-clamp-1 mt-1">
                                                            SKU: {product.sku}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <div>
                                                            <p className="text-lg font-bold text-white">
                                                                ${product.price.toLocaleString()}
                                                            </p>
                                                            {product.inStock ? (
                                                                <p className="text-xs text-emerald-400">In Stock</p>
                                                            ) : (
                                                                <p className="text-xs text-red-400">Out of Stock</p>
                                                            )}
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            className="bg-gold hover:bg-yellow text-navy font-bold"
                                                            onClick={() => handleAddToCart(product)}
                                                            disabled={!product.inStock}
                                                        >
                                                            <ShoppingCart className="w-4 h-4 mr-1" />
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 mb-6">
                            <Heart className="w-10 h-10 text-gold" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">
                            Save items you love by clicking the heart icon on any product. They'll appear here for easy access.
                        </p>
                        <Button
                            className="bg-gold hover:bg-yellow text-navy font-bold"
                            onClick={() => router.push('/products')}
                        >
                            Browse Products
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
