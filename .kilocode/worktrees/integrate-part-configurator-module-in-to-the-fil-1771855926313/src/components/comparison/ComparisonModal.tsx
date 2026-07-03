'use client';

import React, { useState } from 'react';
import { X, Download, Sparkles } from 'lucide-react';
import { IProduct } from '@/types/product';
import { calculateComparisonHighlights } from '@/lib/comparison';
import ComparisonTable from './ComparisonTable';

interface ComparisonModalProps {
    products: IProduct[];
    isOpen: boolean;
    onClose: () => void;
}

export default function ComparisonModal({ products, isOpen, onClose }: ComparisonModalProps) {
    const [highlightDifferences, setHighlightDifferences] = useState(false);

    const highlights = calculateComparisonHighlights(products);

    if (!isOpen) return null;

    const handleExport = () => {
        // Prepare comparison data for export
        const exportData = products.map(p => ({
            Name: p.name,
            SKU: p.sku,
            Brand: p.brand,
            Category: p.category,
            Price: `$${p.price.toFixed(2)}`,
            Stock: p.inStock ? `${p.stock} units` : 'Out of Stock',
            Rating: p.rating?.toFixed(1) || 'N/A',
            'OEM Code': p.oemCode || 'N/A'
        }));

        // Convert to CSV
        const headers = Object.keys(exportData[0]);
        const csvContent = [
            headers.join(','),
            ...exportData.map(row => headers.map(h => `"${row[h as keyof typeof row]}"`).join(','))
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `product-comparison-${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-7xl max-h-[90vh] bg-navy/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Product Comparison</h2>
                        <p className="text-sm text-white/60">
                            Comparing {products.length} {products.length === 1 ? 'product' : 'products'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Highlight Differences Toggle */}
                        <button
                            onClick={() => setHighlightDifferences(!highlightDifferences)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${highlightDifferences
                                    ? 'bg-yellow text-navy'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            Highlight Differences
                        </button>

                        {/* Export Button */}
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            aria-label="Close comparison"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="flex-1 overflow-auto">
                    <ComparisonTable
                        products={products}
                        highlights={highlights}
                        highlightDifferences={highlightDifferences}
                    />
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-white/10 bg-navy/50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-white/60">
                            Scroll horizontally to view all products
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
