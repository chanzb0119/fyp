import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchHeaderProps {
  filters: {
    propertyState: string;
    propertyType: string;
    minPrice: string;
    maxPrice: string;
    beds: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
}

const SearchHeader = ({
  filters,
  onFilterChange,
  onSearch,
}: SearchHeaderProps) => {
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Search and Button Row */}
        <div className="flex gap-2 sm:gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <input
              type="text"
              placeholder="Search location or keyword..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange('searchTerm', e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-2 sm:pr-4 py-2 text-sm sm:text-base border rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button 
            onClick={onSearch}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-8 whitespace-nowrap"
          >
            Search
          </Button>
        </div>

        {/* Filters Toggle for Mobile */}
        <div className="flex md:hidden justify-between items-center border-t pt-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-gray-600 font-medium"
          >
            {showFilters ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Filters
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Filters
              </>
            )}
          </button>
          
          <div className="text-xs text-gray-500">
            {[
              filters.propertyType && 'Type',
              filters.propertyState && 'State',
              filters.minPrice && 'Min',
              filters.maxPrice && 'Max',
              filters.beds && 'Beds'
            ].filter(Boolean).join(', ')}
          </div>
        </div>

        {/* Filters Row - Hidden on mobile unless toggled */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 ${!showFilters && 'hidden md:grid'}`}>
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange('propertyType', e.target.value)}
            className="border rounded-md sm:rounded-lg p-1.5 sm:p-2 text-sm sm:text-base"
          >
            <option value="">All Residential</option>
            <option value="Apartment">Apartment</option>
            <option value="Condominium">Condominium</option>
            <option value="Terrace House">Terrace House</option>
            <option value="Semi-D">Semi-D</option>
            <option value="Bungalow">Bungalow</option>
          </select>

          <select
            value={filters.propertyState}
            onChange={(e) => onFilterChange('propertyState', e.target.value)}
            className="border rounded-md sm:rounded-lg p-1.5 sm:p-2 text-sm sm:text-base"
          >
            <option value="">All States</option>
            <option value="Johor">Johor</option>
            <option value="Kedah">Kedah</option>
            <option value="Kelantan">Kelantan</option>
            <option value="Kuala Lumpur">Kuala Lumpur</option>
            <option value="Melaka">Melaka</option>
            <option value="Negeri Sembilan">Negeri Sembilan</option>
            <option value="Pahang">Pahang</option>
            <option value="Perak">Perak</option>
            <option value="Perlis">Perlis</option>
            <option value="Pulau Pinang">Penang</option>
            <option value="Sabah">Sabah</option>
            <option value="Sarawak">Sarawak</option>
            <option value="Selangor">Selangor</option>
            <option value="Terengganu">Terengganu</option>
          </select>

          <div className="sm:col-span-2 grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min Rent (RM)"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="border rounded-md sm:rounded-lg p-1.5 sm:p-2 text-sm sm:text-base"
            />

            <input
              type="number"
              placeholder="Max Rent (RM)"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="border rounded-md sm:rounded-lg p-1.5 sm:p-2 text-sm sm:text-base"
            />
          </div>

          <select
            value={filters.beds}
            onChange={(e) => onFilterChange('beds', e.target.value)}
            className="border rounded-md sm:rounded-lg p-1.5 sm:p-2 text-sm sm:text-base"
          >
            <option value="">Bedrooms</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;