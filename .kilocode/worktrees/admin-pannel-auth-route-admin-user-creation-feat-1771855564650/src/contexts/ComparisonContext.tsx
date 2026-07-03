'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    isComparisonFull,
    getComparisonCount,
    loadComparisonFromStorage,
    saveComparisonToStorage,
} from '@/lib/comparison';

interface ComparisonContextType {
    comparisonProducts: string[];
    addProduct: (productId: string) => boolean;
    removeProduct: (productId: string) => void;
    clearAll: () => void;
    isProductInComparison: (productId: string) => boolean;
    isFull: boolean;
    count: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
    const [comparisonProducts, setComparisonProducts] = useState<string[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = loadComparisonFromStorage();
        setComparisonProducts(stored);
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever comparison changes
    useEffect(() => {
        if (isInitialized) {
            saveComparisonToStorage(comparisonProducts);
        }
    }, [comparisonProducts, isInitialized]);

    const addProduct = (productId: string): boolean => {
        try {
            const updated = addToComparison(productId, comparisonProducts);
            setComparisonProducts(updated);
            return true;
        } catch (error) {
            console.error('Failed to add product to comparison:', error);
            return false;
        }
    };

    const removeProduct = (productId: string) => {
        const updated = removeFromComparison(productId, comparisonProducts);
        setComparisonProducts(updated);
    };

    const clearAll = () => {
        const updated = clearComparison();
        setComparisonProducts(updated);
    };

    const isProductInComparison = (productId: string): boolean => {
        return isInComparison(productId, comparisonProducts);
    };

    const value: ComparisonContextType = {
        comparisonProducts,
        addProduct,
        removeProduct,
        clearAll,
        isProductInComparison,
        isFull: isComparisonFull(comparisonProducts),
        count: getComparisonCount(comparisonProducts),
    };

    return (
        <ComparisonContext.Provider value={value}>
            {children}
        </ComparisonContext.Provider>
    );
}

export function useComparison() {
    const context = useContext(ComparisonContext);
    if (context === undefined) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
}
