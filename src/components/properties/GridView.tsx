"use client";

import React, { useState, useEffect } from 'react';
import { propertyService } from '@/services/properties';
import PropertyCard from './PropertyCard';
import { Property } from '@/libs/types/database';

interface GridViewProps {
  searchTerm: string;
  filters: {
    propertyType: string;
    minPrice: string;
    maxPrice: string;
    beds: string;
  };
}

const GridView: React.FC<GridViewProps> = ({searchTerm, filters}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    
    const matchesBedrooms = !filters.beds || property.beds === parseInt(filters.beds);
    
    const matchesType = !filters.propertyType || property.type === filters.propertyType;

    return matchesSearch && matchesPrice && matchesBedrooms && matchesType;
  });

  return (
    <div className="space-y-6">

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
              bedrooms={property.beds}
              bathrooms={property.bathrooms}
              size={property.size}
              state={property.state}
              city={property.city}
              type={property.type}
              imageUrl={property.images?.[0] || ''} 
              user_id={property.user_id}     
              carparks={property.carparks}       
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

export default GridView;