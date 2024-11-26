// src\components\properties\SearchHeader.tsx

import React from 'react';
import { Search } from 'lucide-react';
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
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Search and Button Row */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by location or keyword..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button 
            onClick={onSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            Search
          </Button>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange('propertyType', e.target.value)}
            className="border rounded-lg p-2"
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
            className="border rounded-lg p-2"
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
            <option value="Pulau Pinang">Pulau Pinang</option>
            <option value="Sabah">Sabah</option>
            <option value="Sarawak">Sarawak</option>
            <option value="Selangor">Selangor</option>
            <option value="Terengganu">Terengganu</option>
          </select>

          <input
            type="number"
            placeholder="Min Rent (RM)"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Max Rent (RM)"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="border rounded-lg p-2"
          />

          <select
            value={filters.beds}
            onChange={(e) => onFilterChange('beds', e.target.value)}
            className="border rounded-lg p-2"
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