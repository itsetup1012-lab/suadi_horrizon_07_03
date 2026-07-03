'use client';

import React from 'react';
import { Package, Clock, XCircle, ShoppingBag } from 'lucide-react';

export type AvailabilityStatus = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';

type ColorClass = 'text-white' | 'text-green-400' | 'text-yellow' | 'text-red-400' | 'text-blue-400';

interface AvailabilityFilterProps {
    selectedStatus: AvailabilityStatus;
    onStatusChange: (status: AvailabilityStatus) => void;
    productCounts?: {
        in_stock: number;
        low_stock: number;
        out_of_stock: number;
        pre_order: number;
    };
}

export default function AvailabilityFilter({
    selectedStatus,
    onStatusChange,
    productCounts
}: AvailabilityFilterProps) {

    const options: Array<{
        value: AvailabilityStatus;
        label: string;
        icon: React.ElementType;
        color: ColorClass;
        description: string;
    }> = [
            {
                value: 'all',
                label: 'All Products',
                icon: Package,
                color: 'text-white',
                description: 'Show all products'
            },
            {
                value: 'in_stock',
                label: 'In Stock',
                icon: ShoppingBag,
                color: 'text-green-400',
                description: 'Available for immediate shipping'
            },
            {
                value: 'low_stock',
                label: 'Low Stock',
                icon: Clock,
                color: 'text-yellow',
                description: 'Limited quantity available'
            },
            {
                value: 'out_of_stock',
                label: 'Out of Stock',
                icon: XCircle,
                color: 'text-red-400',
                description: 'Currently unavailable'
            },
            {
                value: 'pre_order',
                label: 'Pre-Order',
                icon: Clock,
                color: 'text-blue-400',
                description: 'Available for pre-order'
            }
        ];

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white mb-3">Availability</h3>

            {options.map((option) => {
                const Icon = option.icon as React.ComponentType<{ className?: string }>;
                const count = productCounts?.[option.value as keyof typeof productCounts];
                const isSelected = selectedStatus === option.value;

                return (
                    <button
                        key={option.value}
                        onClick={() => onStatusChange(option.value)}
                        className={`w-full p-3 rounded-lg border transition-all ${isSelected
                            ? 'bg-yellow/10 border-yellow shadow-lg shadow-yellow/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className={'w-5 h-5 flex-shrink-0 ' + (isSelected ? 'text-yellow' : option.color)} />

                            <div className="flex-1 text-left">
                                <div className={'text-sm font-medium ' + (isSelected ? 'text-yellow' : 'text-white')}>
                                    {option.label}
                                </div>
                                <div className="text-xs text-white/50">
                                    {option.description}
                                </div>
                            </div>

                            {count !== undefined && option.value !== 'all' && (
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${isSelected
                                    ? 'bg-yellow/20 text-yellow'
                                    : 'bg-white/10 text-white/70'
                                    }`}>
                                    {count}
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
