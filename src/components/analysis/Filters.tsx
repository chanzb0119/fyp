// components/analysis/Filters.tsx
"use client";

import { useCallback, useMemo, useState } from 'react';
import { Property } from '@/libs/types/database';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { FilterState } from '@/libs/types/filters';

export interface FiltersProps {
  properties: Property[];
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

type FilterValue = string | number;

export default function Filters({ properties, filters, onChange, onReset }: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique values for filters
  const uniqueTypes = Array.from(new Set(properties.map(p => p.type)));
  const uniqueStates = Array.from(new Set(properties.map(p => p.state)));
  const uniqueBeds = Array.from(new Set(properties.map(p => p.beds))).sort((a, b) => (a ?? 0) - (b ?? 0));
  const uniqueFurnishing = Array.from(new Set(properties.map(p => {
    if (!p.furnishing || p.furnishing.trim() === '') {
      return 'Not mentioned';
    }
    return p.furnishing;
  })));
  
  // Get cities based on selected states
  const availableCities = useMemo(() => {
    if (filters.states.length === 0) return [];
    return Array.from(new Set(
      properties
        .filter(p => p.state && filters.states.includes(p.state))
        .map(p => p.city)
    )).filter(city => city) as string[];
  }, [properties, filters.states]);
  
  // Calculate active filters count
  const activeFiltersCount = Object.entries(filters).reduce((count, [, value]) => {
    return count + ((Array.isArray(value) && value.length > 0) ? 1 : 0);
  }, 0);

  const handleCheckboxChange = useCallback((filterType: keyof Omit<FilterState, 'priceRange'>, value: FilterValue) => {
    if (filterType === 'states') {
      onChange({
        ...filters,
        states: (filters.states as string[]).includes(value as string)
          ? (filters.states as string[]).filter(v => v !== value)
          : [...(filters.states as string[]), value as string],
        cities: []
      });
    } else {
      onChange({
        ...filters,
        [filterType]: (filters[filterType] as Array<FilterValue>).includes(value)
          ? (filters[filterType] as Array<FilterValue>).filter(v => v !== value)
          : [...(filters[filterType] as Array<FilterValue>), value]
      });
    }
  }, [filters, onChange]);


  return (
    <div className="sticky top-0 z-50 bg-white shadow-lg transition-all duration-300">
      {/* Collapsed Header */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="font-semibold text-gray-900">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {/* Expanded Filters */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="p-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Property Type Filter */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Property Type</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                {uniqueTypes.map(type => type && (
                  <label key={type} className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.propertyType.includes(type)}
                      onChange={() => handleCheckboxChange('propertyType', type)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* State and City Filters */}
            <div className="space-y-4">
              {/* State Filter */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">State</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {uniqueStates.map(state => state && (
                    <label key={state} className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.states.includes(state)}
                        onChange={() => handleCheckboxChange('states', state)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{state}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* City Filter - Only shown when state is selected */}
              {filters.states.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">City</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                    {availableCities.map(city => (
                      <label key={city} className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.cities.includes(city)}
                          onChange={() => handleCheckboxChange('cities', city)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Furnishing Filter */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Furnishing</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                {uniqueFurnishing.map(furnishing => (
                  <label key={furnishing} className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.furnishing.includes(furnishing)}
                      onChange={() => handleCheckboxChange('furnishing', furnishing)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{furnishing}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Beds Filter */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Beds</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                {uniqueBeds.map(count => count !== undefined && (
                  <label key={count} className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.beds.includes(count)}
                      onChange={() => handleCheckboxChange('beds', count)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{count} Beds</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={onReset}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}