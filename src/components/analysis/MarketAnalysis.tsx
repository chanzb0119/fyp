// components/analysis/MarketAnalysis.tsx
"use client";

import { propertyService } from "@/services/properties";
import { useState, useEffect, useMemo } from "react";
import MarketAnalysisDashboard from "./MarketAnalysisDashboard";
import Filters from "./Filters";
import { Property } from '@/libs/types/database';
import { FilterState } from "@/libs/types/filters";

const MarketAnalysis = () => {
const [properties, setProperties] = useState<Property[]>([]);
const [filters, setFilters] = useState<FilterState>({
    propertyType: [],
    cities: [],
    states: [],
    priceRange: {
    min: 0,
    max: 999999999
    },
    bedrooms: [],
    furnishing: []
});

useEffect(() => {
    loadProperties();
}, []);

const loadProperties = async () => {
    try {
    const data = await propertyService.getProperties();
    setProperties(data);
    
    // Set initial price range based on data
    const prices = data.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    setFilters(prev => ({
        ...prev,
        priceRange: {
        min: minPrice,
        max: maxPrice
        }
    }));
    } catch (err) {
    console.error(err);
    }
};

const filteredProperties = useMemo(() => {
    return properties.filter((property: Property) => {
    // Filter by property type
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.type ?? '')) {
        return false;
    }

    // Filter by state
    if (filters.states.length > 0 && !filters.states.includes(property.state ?? '')) {
      return false;
    }

    // Filter by city
    if (filters.cities.length > 0 && !filters.cities.includes(property.city ?? '')) {
        return false;
    }

    // Filter by price range
    if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) {
        return false;
    }

    // Filter by bedrooms
    if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(property.bedrooms ?? 0)) {
        return false;
    }

    // Filter by furnishing
    if (filters.furnishing.length > 0 && !filters.furnishing.includes(property.furnishing ?? '')) {
        return false;
    }

    return true;
    });
}, [properties, filters]);

const resetFilters = () => {
    const prices = properties.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    setFilters({
    propertyType: [],
    cities: [],
    states: [],  
    priceRange: {
        min: minPrice,
        max: maxPrice
    },
    bedrooms: [],
    furnishing: []
    });
};

const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
};

return (
    <div>
    <Filters 
        properties={properties}
        filters={filters}
        onChange={handleFilterChange}
        onReset={resetFilters}
    />
    <MarketAnalysisDashboard properties={filteredProperties} />
    </div>
);
};

export default MarketAnalysis;