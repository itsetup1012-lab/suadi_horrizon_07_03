'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Equipment } from '@/lib/equipment';
import EquipmentSelector from './EquipmentSelector';

interface ConfiguratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEquipmentSelect: (equipment: Equipment | null) => void;
    selectedEquipment?: Equipment | null;
    equipmentData: any;
}

export default function ConfiguratorModal({
    isOpen,
    onClose,
    onEquipmentSelect,
    selectedEquipment,
    equipmentData
}: ConfiguratorModalProps) {

    const handleEquipmentSelect = (equipment: Equipment | null) => {
        onEquipmentSelect(equipment);
        if (equipment) {
            // Close modal after selection
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-navy/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Equipment Configurator</h2>
                        <p className="text-sm text-white/60">
                            Select your equipment to find compatible parts
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        aria-label="Close configurator"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    <EquipmentSelector
                        equipmentData={equipmentData}
                        onEquipmentSelect={handleEquipmentSelect}
                        selectedEquipment={selectedEquipment}
                    />
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-white/10 bg-navy/50">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
