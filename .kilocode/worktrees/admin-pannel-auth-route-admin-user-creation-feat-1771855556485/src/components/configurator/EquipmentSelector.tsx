'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { Equipment, getEquipmentHierarchy } from '@/lib/equipment';
import { useEquipmentSearch } from '@/hooks/useEquipmentSearch';
import EquipmentCard from './EquipmentCard';

interface EquipmentSelectorProps {
    equipmentData: any;
    onEquipmentSelect: (equipment: Equipment | null) => void;
    selectedEquipment?: Equipment | null;
}

export default function EquipmentSelector({
    equipmentData,
    onEquipmentSelect,
    selectedEquipment
}: EquipmentSelectorProps) {
    const [mode, setMode] = useState<'search' | 'browse'>('search');

    // Search mode state
    const { query, setQuery, results, suggestions, addToHistory } = useEquipmentSearch(equipmentData);

    // Browse mode state
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [selectedYearRange, setSelectedYearRange] = useState<string>('');

    const hierarchy = getEquipmentHierarchy(equipmentData);

    // Get filtered data for browse mode
    const availableTypes = hierarchy;
    const availableBrands = selectedType
        ? hierarchy.find((t: any) => t.id === selectedType)?.brands || []
        : [];
    const availableModels = selectedBrand
        ? availableBrands.find((b: any) => b.id === selectedBrand)?.models || []
        : [];
    const availableYearRanges = selectedModel
        ? availableModels.find((m: any) => m.id === selectedModel)?.yearRanges || []
        : [];

    // Handle search selection
    const handleSearchSelect = (equipment: Equipment) => {
        addToHistory(query);
        onEquipmentSelect(equipment);
        setQuery('');
    };

    // Handle browse selection
    const handleBrowseSelect = () => {
        if (!selectedType || !selectedBrand || !selectedModel) return;

        const type = hierarchy.find((t: any) => t.id === selectedType);
        const brand = availableBrands.find((b: any) => b.id === selectedBrand);
        const model = availableModels.find((m: any) => m.id === selectedModel);

        if (type && brand && model) {
            const equipment: Equipment = {
                id: `${model.compatibilityId}${selectedYearRange ? `-${selectedYearRange}` : ''}`,
                type: type.id,
                typeName: type.name,
                brand: brand.name,
                brandId: brand.id,
                model: model.name,
                modelId: model.id,
                yearRange: selectedYearRange || undefined,
                compatibilityId: model.compatibilityId
            };

            onEquipmentSelect(equipment);

            // Reset browse form
            setSelectedType('');
            setSelectedBrand('');
            setSelectedModel('');
            setSelectedYearRange('');
        }
    };

    // Reset browse selections when changing previous selections
    useEffect(() => {
        setSelectedBrand('');
        setSelectedModel('');
        setSelectedYearRange('');
    }, [selectedType]);

    useEffect(() => {
        setSelectedModel('');
        setSelectedYearRange('');
    }, [selectedBrand]);

    useEffect(() => {
        setSelectedYearRange('');
    }, [selectedModel]);

    return (
        <div className="bg-navy/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Configure by Equipment</h2>

                {/* Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('search')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'search'
                                ? 'bg-yellow text-navy'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        Search
                    </button>
                    <button
                        onClick={() => setMode('browse')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'browse'
                                ? 'bg-yellow text-navy'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        Browse
                    </button>
                </div>
            </div>

            {/* Search Mode */}
            {mode === 'search' && (
                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search equipment (e.g., CAT 320D, JCB 3CX...)"
                            className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Search Results */}
                    {results.length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-lg divide-y divide-white/10 max-h-[300px] overflow-y-auto">
                            {results.map((equipment) => (
                                <button
                                    key={equipment.id}
                                    onClick={() => handleSearchSelect(equipment)}
                                    className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors"
                                >
                                    <div className="text-white font-medium">
                                        {equipment.brand} {equipment.model}
                                    </div>
                                    <div className="text-sm text-white/70">
                                        {equipment.typeName}
                                        {equipment.yearRange && ` • ${equipment.yearRange}`}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {query && results.length === 0 && (
                        <div className="text-center py-8 text-white/50">
                            No equipment found. Try different keywords.
                        </div>
                    )}
                </div>
            )}

            {/* Browse Mode */}
            {mode === 'browse' && (
                <div className="space-y-4">
                    {/* Equipment Type */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Equipment Type
                        </label>
                        <div className="relative">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent"
                            >
                                <option value="" className="bg-navy text-white">
                                    Select equipment type...
                                </option>
                                {availableTypes.map((type: any) => (
                                    <option key={type.id} value={type.id} className="bg-navy text-white">
                                        {type.icon} {type.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                        </div>
                    </div>

                    {/* Brand */}
                    {selectedType && (
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Brand
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent"
                                >
                                    <option value="" className="bg-navy text-white">
                                        Select brand...
                                    </option>
                                    {availableBrands.map((brand: any) => (
                                        <option key={brand.id} value={brand.id} className="bg-navy text-white">
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Model */}
                    {selectedBrand && (
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Model
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent"
                                >
                                    <option value="" className="bg-navy text-white">
                                        Select model...
                                    </option>
                                    {availableModels.map((model: any) => (
                                        <option key={model.id} value={model.id} className="bg-navy text-white">
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Year Range (Optional) */}
                    {selectedModel && availableYearRanges.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Year Range (Optional)
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedYearRange}
                                    onChange={(e) => setSelectedYearRange(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent"
                                >
                                    <option value="" className="bg-navy text-white">
                                        All years
                                    </option>
                                    {availableYearRanges.map((range: string) => (
                                        <option key={range} value={range} className="bg-navy text-white">
                                            {range}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Find Parts Button */}
                    {selectedModel && (
                        <button
                            onClick={handleBrowseSelect}
                            className="w-full px-6 py-3 bg-yellow text-navy font-semibold rounded-lg hover:bg-yellow/90 transition-colors"
                        >
                            Find Compatible Parts
                        </button>
                    )}
                </div>
            )}

            {/* Selected Equipment Display */}
            {selectedEquipment && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-white/70">Selected Equipment</h3>
                        <button
                            onClick={() => onEquipmentSelect(null)}
                            className="text-white/50 hover:text-white text-sm"
                        >
                            Clear
                        </button>
                    </div>
                    <EquipmentCard equipment={selectedEquipment} />
                </div>
            )}
        </div>
    );
}
