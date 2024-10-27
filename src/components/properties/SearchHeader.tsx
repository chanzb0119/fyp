// src/components/properties/SearchHeader.tsx
import { Search, LayoutGrid, Map } from 'lucide-react';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    propertyType: string;
    minPrice: string;
    maxPrice: string;
    bedrooms: string;
  };
  onFilterChange: (key: string, value: string) => void;
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
}

const SearchHeader = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
}: SearchHeaderProps) => {
  return (
    <div className="bg-white sticky top-0 z-10 border-b">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Search and View Toggle Row */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex rounded-lg border bg-gray-50 p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="h-5 w-5 mr-2" />
              Grid
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Map className="h-5 w-5 mr-2" />
              Map
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange('propertyType', e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="">Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="border rounded-lg p-2"
          />

          <select
            value={filters.bedrooms}
            onChange={(e) => onFilterChange('bedrooms', e.target.value)}
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