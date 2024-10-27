// src/components/properties/PropertiesView.tsx
"use client";

import { useState } from "react";
import GridView from "./GridView";
import MapView from "./MapView";
import SearchHeader from "./SearchHeader";

type ViewMode = 'map' | 'grid';

const PropertiesView = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        propertyType: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: ''
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SearchHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />
            
            {viewMode === 'grid' ? (
                <GridView
                    searchTerm={searchTerm}
                    filters={filters}
                />
            ) : (
                <MapView
                    searchTerm={searchTerm}
                    filters={filters}
                />
            )}
        </div>
    );
};

export default PropertiesView;