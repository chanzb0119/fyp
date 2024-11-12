// src/components/properties/GridView.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { propertyService } from '@/services/properties';
import PropertyCard from './PropertyCard';
import Pagination from '@/components/ui/pagination';
import { Property } from '@/libs/types/database';
import { useSearchParams, useRouter } from 'next/navigation';

interface GridViewProps {
  searchTerm: string;
  filters: {
    propertyState: string;
    propertyType: string;
    minPrice: string;
    maxPrice: string;
    beds: string;
  };
}

const GridView: React.FC<GridViewProps> = ({ searchTerm, filters }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;
  const ITEMS_PER_PAGE = 18;

  useEffect(() => {
    loadProperties();
  }, [currentPage, searchTerm, filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getPaginatedProperties(
        { page: currentPage, limit: ITEMS_PER_PAGE },
        { ...filters, searchTerm }
      );
      
      setProperties(response.data);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.set('page', newPage.toString());
    router.push(`?${currentSearchParams.toString()}`);
  };

  // Calculate the range of items being displayed
  const startRange = ((currentPage - 1) * ITEMS_PER_PAGE) + 1;
  const endRange = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-12">Loading properties...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-4">
            Viewing {startRange}-{endRange} of {totalCount} property results
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                imageUrl={property.images?.[0] || ''}
              />
            ))}
          </div>

          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {!loading && !error && properties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found matching your criteria
        </div>
      )}
    </div>
  );
};

export default GridView;