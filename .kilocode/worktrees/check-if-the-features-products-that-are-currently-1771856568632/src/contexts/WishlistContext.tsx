'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface WishlistContextType {
    wishlistItems: string[];
    addToWishlist: (productId: string) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<string[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            try {
                setWishlistItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse wishlist:', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, isInitialized]);

    const addToWishlist = useCallback((productId: string) => {
        setWishlistItems(prev => {
            if (prev.includes(productId)) {
                toast.info('Item is already in your wishlist');
                return prev;
            }
            toast.success('Added to wishlist');
            return [...prev, productId];
        });
    }, []);

    const removeFromWishlist = useCallback((productId: string) => {
        setWishlistItems(prev => {
            const newList = prev.filter(id => id !== productId);
            toast.success('Removed from wishlist');
            return newList;
        });
    }, []);

    const isInWishlist = useCallback((productId: string) => {
        return wishlistItems.includes(productId);
    }, [wishlistItems]);

    const clearWishlist = useCallback(() => {
        setWishlistItems([]);
        toast.success('Wishlist cleared');
    }, []);

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            clearWishlist,
            wishlistCount: wishlistItems.length,
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
