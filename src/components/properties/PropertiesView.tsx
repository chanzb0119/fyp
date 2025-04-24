// src/components/properties/PropertiesView.tsx

"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GridView from './GridView';
import SearchHeader from './SearchHeader';
import SortDropdown from './SortDropdown';

const PropertiesView = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Current filters in the search form
    const [formFilters, setFormFilters] = React.useState({
        propertyState: searchParams.get('state') || '',
        propertyType: searchParams.get('type') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        beds: searchParams.get('beds') || '',
        searchTerm: searchParams.get('q') || ''
    });

    // Current sort value
    const [sortValue] = React.useState(
        searchParams.get('sort') || 'default'
    );

    // Active filters that are actually being used for search
    const activeFilters = {
        propertyState: searchParams.get('state') || '',
        propertyType: searchParams.get('type') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        beds: searchParams.get('beds') || '',
        searchTerm: searchParams.get('q') || '',
        sort: searchParams.get('sort') || 'default'
    };

    // Handle filter changes without immediate search
    const handleFilterChange = (key: string, value: string) => {
        setFormFilters(prev => ({ ...prev, [key]: value }));
    };

    // Handle sort change
    const handleSortChange = (value: string) => {
        // Create new query string with current params
        const queryString = new URLSearchParams(searchParams.toString());
        queryString.set('sort', value);
        queryString.set('page', '1'); // Reset to page 1 when sorting changes
        
        // Update URL and trigger new search
        router.push(`/properties?${queryString.toString()}`);
    };

    // Handle search button click
    const handleSearch = () => {
        const queryString = new URLSearchParams();
        
        if (formFilters.propertyState) queryString.append('state', formFilters.propertyState);
        if (formFilters.propertyType) queryString.append('type', formFilters.propertyType);
        if (formFilters.minPrice) queryString.append('minPrice', formFilters.minPrice);
        if (formFilters.maxPrice) queryString.append('maxPrice', formFilters.maxPrice);
        if (formFilters.beds) queryString.append('beds', formFilters.beds);
        if (formFilters.searchTerm) queryString.append('q', formFilters.searchTerm);
        if (sortValue !== 'default') queryString.append('sort', sortValue);

        // Reset to page 1 when searching
        queryString.append('page', '1');

        // Update URL and trigger new search
        router.push(`/properties?${queryString.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SearchHeader
                filters={formFilters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
            />
            
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Sort Dropdown */}
                <div className="mb-6">
                    <SortDropdown 
                        value={searchParams.get('sort') || 'default'}
                        onSortChange={handleSortChange}
                    />
                </div>

                <GridView
                    filters={activeFilters}
                    currentPage={Number(searchParams.get('page')) || 1}
                />
            </div>
        </div>
    );
};

export default PropertiesView;