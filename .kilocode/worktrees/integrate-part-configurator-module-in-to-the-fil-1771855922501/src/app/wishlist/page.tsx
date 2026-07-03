'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock wishlist data
const mockWishlist = [
    {
        id: '1',
        name: 'Caterpillar Engine Oil Filter',
        price: 25,
        image: '/api/placeholder/150/150',
        inStock: true,
    },
    {
        id: '2',
        name: 'Hydraulic Pump Assembly',
        price: 450,
        image: '/api/placeholder/150/150',
        inStock: true,
    },
    {
        id: '3',
        name: 'Turbocharger Kit',
        price: 750,
        image: '/api/placeholder/150/150',
        inStock: false,
    },
];

export default function WishlistPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [wishlist, setWishlist] = React.useState(mockWishlist);

    React.useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/wishlist');
        }
    }, [isAuthenticated, router]);

    const removeFromWishlist = (id: string) => {
        setWishlist(wishlist.filter(item => item.id !== id));
        toast.success('Item removed from wishlist');
    };

    const addToCartFromWishlist = (item: typeof mockWishlist[0]) => {
        if (item.inStock) {
            toast.success(`${item.name} added to cart`);
            removeFromWishlist(item.id);
        }
    };

    const totalItems = wishlist.length;
    const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Wishlist</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                        My Wishlist
                    </h1>
                    <p className="text-muted-foreground">{totalItems} items</p>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Wishlist Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {wishlist.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="glass-light dark:glass-dark">
                                        <CardContent className="p-4">
                                            <div className="flex gap-4">
                                                {/* Product Image */}
                                                <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                                        <Package className="w-8 h-8 text-primary/50" />
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold truncate">{item.name}</h3>
                                                    <p className="text-xl font-bold text-primary mt-1">KWD {item.price.toFixed(2)}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${item.inStock ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        size="sm"
                                                        disabled={!item.inStock}
                                                        onClick={() => addToCartFromWishlist(item)}
                                                    >
                                                        <ShoppingCart className="w-4 h-4 mr-1" />
                                                        Add
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeFromWishlist(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <Card className="glass-strong sticky top-8">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-4">Wishlist Summary</h3>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Items</span>
                                            <span>{totalItems}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Value</span>
                                            <span className="font-semibold">KWD {totalValue.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Button className="w-full" onClick={() => router.push('/products')}>
                                        Continue Shopping
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mb-6">Save items you love to your wishlist</p>
                        <Button onClick={() => router.push('/products')}>
                            Browse Products
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
