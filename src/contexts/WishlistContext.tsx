'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { getWishlist, addToWishlistApi, removeFromWishlistApi } from '@/api/user';

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
    const { isAuthenticated, isInitialized: isAuthInitialized } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<string[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load: from localStorage if unauthenticated, from API if authenticated
    useEffect(() => {
        const loadWishlist = async () => {
            if (!isAuthInitialized) return;

            if (isAuthenticated) {
                try {
                    const apiItems = await getWishlist();
                    // Normalize: API may return undefined, null, or a non-array
                    setWishlistItems(Array.isArray(apiItems) ? apiItems : []);
                } catch (error) {
                    console.error('Failed to load wishlist from API:', error);
                    loadFromLocal();
                }
            } else {
                loadFromLocal();
            }
            setIsInitialized(true);
        };

        const loadFromLocal = () => {
            const saved = localStorage.getItem('wishlist');
            if (saved) {
                try {
                    setWishlistItems(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse wishlist:', e);
                }
            }
        };

        loadWishlist();
    }, [isAuthenticated, isAuthInitialized]);

    // Simple persist to local only if unauthenticated or as a local backup
    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, isInitialized, isAuthenticated]);

    const addToWishlist = useCallback(async (productId: string) => {
        if (wishlistItems.includes(productId)) {
            toast.info('Item is already in your wishlist');
            return;
        }

        try {
            if (isAuthenticated) {
                await addToWishlistApi(productId);
            }
            setWishlistItems(prev => [...prev, productId]);
            toast.success('Added to wishlist');
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            if (isAuthenticated) {
                toast.error('Failed to sync with account');
            } else {
                setWishlistItems(prev => [...prev, productId]);
                toast.success('Added to wishlist (local)');
            }
        }
    }, [wishlistItems, isAuthenticated]);

    const removeFromWishlist = useCallback(async (productId: string) => {
        try {
            if (isAuthenticated) {
                await removeFromWishlistApi(productId);
            }
            setWishlistItems(prev => prev.filter(id => id !== productId));
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            if (isAuthenticated) {
                toast.error('Failed to remove from account');
            } else {
                setWishlistItems(prev => prev.filter(id => id !== productId));
                toast.success('Removed from wishlist');
            }
        }
    }, [isAuthenticated]);

    const isInWishlist = useCallback((productId: string) => {
        return wishlistItems.includes(productId);
    }, [wishlistItems]);

    const clearWishlist = useCallback(() => {
        setWishlistItems([]);
        localStorage.removeItem('wishlist');
        toast.success('Wishlist cleared');
    }, []);

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            clearWishlist,
            wishlistCount: Array.isArray(wishlistItems) ? wishlistItems.length : 0,
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
