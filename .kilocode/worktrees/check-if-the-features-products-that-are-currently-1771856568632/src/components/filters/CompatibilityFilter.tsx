'use client';

import React from 'react';
import { CheckCircle2, Search, X } from 'lucide-react';
import { Equipment, getEquipmentDisplayName } from '@/lib/equipment';
import EquipmentCard from '../configurator/EquipmentCard';

interface CompatibilityFilterProps {
    selectedEquipment?: Equipment | null;
    onClear: () => void;
    onChangeEquipment: () => void;
    compatibleOnly: boolean;
    onCompatibleOnlyChange: (value: boolean) => void;
}

export default function CompatibilityFilter({
    selectedEquipment,
    onClear,
    onChangeEquipment,
    compatibleOnly,
    onCompatibleOnlyChange
}: CompatibilityFilterProps) {

    if (!selectedEquipment) {
        return (
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-white/50" />
                    <h3 className="text-sm font-semibold text-white">Equipment Compatibility</h3>
                </div>
                <p className="text-xs text-white/60 mb-3">
                    Select equipment from the configurator to filter compatible parts
                </p>
                <button
                    onClick={onChangeEquipment}
                    className="w-full px-4 py-2 bg-yellow/20 hover:bg-yellow/30 border border-yellow/30 text-yellow text-sm font-medium rounded-lg transition-colors"
                >
                    Select Equipment
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Equipment Compatibility</h3>
                <button
                    onClick={onClear}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                >
                    Clear
                </button>
            </div>

            {/* Selected Equipment Card */}
            <EquipmentCard equipment={selectedEquipment} compact />

            {/* Compatible Only Toggle */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={compatibleOnly}
                        onChange={(e) => onCompatibleOnlyChange(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="relative w-10 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow"></div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-white">Show Compatible Only</div>
                        <div className="text-xs text-white/60">Filter products matching this equipment</div>
                    </div>
                </label>
            </div>

            {/* Change Equipment Button */}
            <button
                onClick={onChangeEquipment}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
            >
                Change Equipment
            </button>
        </div>
    );
}
