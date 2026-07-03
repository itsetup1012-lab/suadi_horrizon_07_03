import { useState, useEffect, useMemo } from 'react';
import { searchEquipment, Equipment } from '@/lib/equipment';

interface UseEquipmentSearchOptions {
    debounceMs?: number;
    maxResults?: number;
}

export function useEquipmentSearch(
    equipmentData: any,
    options: UseEquipmentSearchOptions = {}
) {
    const { debounceMs = 300, maxResults = 10 } = options;

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    // Debounce the search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, debounceMs]);

    // Perform search
    const results = useMemo(() => {
        if (!debouncedQuery.trim()) return [];

        const allResults = searchEquipment(debouncedQuery, equipmentData);
        return allResults.slice(0, maxResults);
    }, [debouncedQuery, equipmentData, maxResults]);

    // Add to search history
    const addToHistory = (searchTerm: string) => {
        if (!searchTerm.trim()) return;

        setSearchHistory(prev => {
            const filtered = prev.filter(term => term !== searchTerm);
            return [searchTerm, ...filtered].slice(0, 5); // Keep last 5 searches
        });
    };

    // Get autocomplete suggestions
    const suggestions = useMemo(() => {
        if (!query.trim()) return searchHistory;

        // Return results as suggestions
        return results.map(result =>
            `${result.brand} ${result.model}${result.yearRange ? ` (${result.yearRange})` : ''}`
        );
    }, [query, results, searchHistory]);

    return {
        query,
        setQuery,
        results,
        suggestions,
        addToHistory,
        searchHistory,
        isSearching: query !== debouncedQuery,
    };
}
