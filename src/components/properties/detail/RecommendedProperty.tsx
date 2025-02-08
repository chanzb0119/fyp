"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from '../PropertyCard';
import { Property } from '@/lib/types/database';
import { recommendationService } from '@/services/recommendations';

interface RecommendedPropertiesProps {
  propertyId: string;
  userId?: string;
}

const RecommendedProperties = ({ propertyId, userId }: RecommendedPropertiesProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const propertiesPerView = 3;
  const totalSlides = Math.ceil(properties.length / propertiesPerView);

  // Helper function to parse images array
  const parseImages = (property: any): Property => {
    try {
      // Check if images is a string and needs parsing
      const images = typeof property.images === 'string' 
        ? JSON.parse(property.images)
        : property.images || [];

      return {
        ...property,
        images: Array.isArray(images) ? images : []
      };
    } catch (e) {
      console.error('Error parsing images:', e);
      return {
        ...property,
        images: []
      };
    }
  };

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        let recommendedProperties: Property[];

        if (propertyId) {
          const response = await recommendationService.getContentBasedRecommendations(
            propertyId,
            6
          );
          // Parse images for each property
          recommendedProperties = response.map(parseImages);
        } else if (userId) {
          const response = await recommendationService.getCollaborativeRecommendations(
            userId,
            6
          );
          // Parse images for each property
          recommendedProperties = response.map(parseImages);
        } else {
          throw new Error('Either propertyId or userId must be provided');
        }

        setProperties(recommendedProperties);
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [propertyId, userId]);

  const handleNext = () => {
    if (isAnimating || activeSlide >= totalSlides - 1) return;
    setIsAnimating(true);
    setActiveSlide(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating || activeSlide <= 0) return;
    setIsAnimating(true);
    setActiveSlide(prev => prev - 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Other properties you may interest</h2>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Other properties you may interest</h2>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Other properties you may interest</h2>
        <div className="text-center py-8 text-gray-500">No recommendations available</div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Other properties you may interest</h2>
      
      <div className="relative px-4">
        {/* Navigation Buttons */}
        {activeSlide > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 hover:scale-110 focus:outline-none"
            aria-label="Previous properties"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
        )}
        
        {activeSlide < totalSlides - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 hover:scale-110 focus:outline-none"
            aria-label="Next properties"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        )}

        {/* Properties Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div 
                key={slideIndex} 
                className="w-full flex-none grid grid-cols-3 gap-6"
              >
                {properties
                  .slice(slideIndex * propertiesPerView, (slideIndex + 1) * propertiesPerView)
                  .map((property) => (
                    <div
                      key={property.property_id}
                      className="w-full"
                    >
                      <PropertyCard 
                        {...property} 
                        imageUrl={property.images?.[0] || '/api/placeholder/400/300'} 
                      />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setActiveSlide(i);
                  setTimeout(() => setIsAnimating(false), 500);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSlide === i
                  ? 'bg-blue-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedProperties;