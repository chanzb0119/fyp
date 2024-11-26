// src\components\properties\GridView.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { propertyService } from '@/services/properties';
import PropertyCard from './PropertyCard';
import Pagination from '@/components/ui/pagination';
import { Property } from '@/lib/types/database';

interface GridViewProps {
    filters: {
        propertyState: string;
        propertyType: string;
        minPrice: string;
        maxPrice: string;
        beds: string;
        searchTerm: string;
    };
    currentPage: number;
}

const GridView: React.FC<GridViewProps> = ({ filters, currentPage }) => {
    const router = useRouter();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const ITEMS_PER_PAGE = 18;
    const searchParams = useSearchParams();

    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                const response = await propertyService.getPaginatedProperties(
                    { page: currentPage, limit: ITEMS_PER_PAGE },
                    filters
                );
                
                setProperties(response.data);
                setTotalPages(response.totalPages);
                setTotalCount(response.totalCount);

                // If we're on a page number higher than the total pages,
                // redirect to page 1
                if (currentPage > response.totalPages && response.totalPages > 0) {
                    const newQueryString = new URLSearchParams(searchParams.toString());
                    newQueryString.set('page', '1');
                    router.push(`/properties?${newQueryString.toString()}`);
                }
            } catch (err) {
                setError('Failed to load properties');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, [searchParams]); // Only depend on searchParams instead of filters and currentPage

    // Handle page change
    const handlePageChange = (newPage: number) => {
        const newQueryString = new URLSearchParams(searchParams.toString());
        newQueryString.set('page', newPage.toString());
        router.push(`/properties?${newQueryString.toString()}`);
    };

    // Calculate the range of items being displayed
    const startRange = ((currentPage - 1) * ITEMS_PER_PAGE) + 1;
    const endRange = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

    if (loading) {
        return <div className="text-center py-12">Loading properties...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    if (properties.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No properties found matching your criteria
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-sm text-gray-500 mb-4">
                Showing {startRange}-{endRange} of {totalCount} properties
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <PropertyCard
                        key={property.property_id}
                        {...property}
                        imageUrl={property.images?.[0] || ''}
                    />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default GridView;