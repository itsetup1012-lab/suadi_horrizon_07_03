'use client';

import React from 'react';
import { CheckCircle2, Wrench } from 'lucide-react';
import { Equipment, getEquipmentDisplayName } from '@/lib/equipment';

interface EquipmentCardProps {
    equipment: Equipment;
    compact?: boolean;
}

export default function EquipmentCard({ equipment, compact = false }: EquipmentCardProps) {
    const displayName = getEquipmentDisplayName(equipment);

    if (compact) {
        return (
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-yellow flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{displayName}</div>
                    <div className="text-xs text-white/60">{equipment.typeName}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-5 hover:border-yellow/50 transition-all duration-300 group">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }} />
            </div>

            <div className="relative">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow/20 border border-yellow/30 rounded-lg flex items-center justify-center group-hover:bg-yellow/30 transition-colors">
                        <Wrench className="w-6 h-6 text-yellow" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1">{displayName}</h3>
                        <p className="text-sm text-white/70">{equipment.typeName}</p>
                    </div>

                    {/* Verified Badge */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow/20 border border-yellow/30 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-yellow" />
                            <span className="text-xs font-medium text-yellow">Selected</span>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="text-xs text-white/50 mb-1">Brand</div>
                        <div className="text-sm font-medium text-white">{equipment.brand}</div>
                    </div>
                    <div>
                        <div className="text-xs text-white/50 mb-1">Model</div>
                        <div className="text-sm font-medium text-white">{equipment.model}</div>
                    </div>
                    {equipment.yearRange && (
                        <>
                            <div>
                                <div className="text-xs text-white/50 mb-1">Year Range</div>
                                <div className="text-sm font-medium text-white">{equipment.yearRange}</div>
                            </div>
                            <div>
                                <div className="text-xs text-white/50 mb-1">Compatibility ID</div>
                                <div className="text-sm font-medium text-white font-mono text-xs">{equipment.compatibilityId}</div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
