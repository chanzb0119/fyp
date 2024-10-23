"use client";

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { propertyService } from '@/services/properties';
import PropertyCard from './PropertyCard';
import { Property } from '@/libs/types/database';

const PropertiesGrid = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: ''
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertyService.getProperties();
      setProperties(data);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = (!filters.minPrice || property.price >= parseFloat(filters.minPrice)) &&
                        (!filters.maxPrice || property.price <= parseFloat(filters.maxPrice));
    
    const matchesBedrooms = !filters.bedrooms || property.bedrooms === parseInt(filters.bedrooms);
    
    const matchesType = !filters.propertyType || property.type === filters.propertyType;

    return matchesSearch && matchesPrice && matchesBedrooms && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
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
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            className="border rounded-lg p-2"
          />

          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
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

      {/* Properties Grid */}
      {loading ? (
        <div className="text-center py-12">Loading properties...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              price={property.price}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              size={property.size}
              state={property.state}
              city={property.city}
              type={property.type}
              imageUrl={property.images?.[0] || ''} 
              user_id={property.user_id}            
              />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredProperties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found matching your criteria
        </div>
      )}
    </div>
  );
};

export default PropertiesGrid;