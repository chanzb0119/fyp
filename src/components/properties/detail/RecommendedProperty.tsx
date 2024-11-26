"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from '../PropertyCard';

interface RecommendedProperty {
  property_id: string;
  title: string;
  price: number;
  beds: number;
  bathrooms: number;
  carparks: number;
  size: number;
  state: string;
  city: string;
  type: string;
  imageUrl: string;
  user_id: string;
  created_at: string;
}

interface RecommendedPropertiesProps {
  propertyId: string;  // Current property ID for content-based filtering
  userId?: string;     // Current user ID for collaborative filtering
}

const RecommendedProperties = ({ propertyId, userId }: RecommendedPropertiesProps) => {
  // TODO: Replace with actual API call using propertyId and userId
  const dummyProperties = [
    {
      property_id: '1',
      title: 'Modern Apartment in City Center',
      price: 2500,
      beds: 3,
      bathrooms: 2,
      carparks: 1,
      size: 1200,
      state: 'Selangor',
      city: 'Petaling Jaya',
      type: 'Apartment',
      imageUrl: 'https://znoujhfvqhcxwjlafcvf.supabase.co/storage/v1/object/public/property-images/property-images/3ee50ace-4d3a-4d4f-bc2e-57c0cf93296c.jpg',
      user_id: '123',
      created_at: '2024-01-01'
    },
    {
        property_id: '2',
        title: 'Modern Apartment in City Center',
        price: 2500,
        beds: 3,
        bathrooms: 2,
        carparks: 1,
        size: 1200,
        state: 'Selangor',
        city: 'Petaling Jaya',
        type: 'Apartment',
        imageUrl: 'https://znoujhfvqhcxwjlafcvf.supabase.co/storage/v1/object/public/property-images/property-images/5df9e366-908f-4057-9c52-8f616b8b526e.jpg',
        user_id: '123',
        created_at: '2024-01-01'
      },
      {
        property_id: '3',
        title: 'Modern Apartment in City Center',
        price: 2500,
        beds: 3,
        bathrooms: 2,
        carparks: 1,
        size: 1200,
        state: 'Selangor',
        city: 'Petaling Jaya',
        type: 'Apartment',
        imageUrl: 'https://znoujhfvqhcxwjlafcvf.supabase.co/storage/v1/object/public/property-images/property-images/4167cd0f-a32c-44a2-8789-1cab30c8eec6.jpg',
        user_id: '123',
        created_at: '2024-01-01'
      },
      {
        property_id: '4',
        title: 'Modern Apartment in City Center4',
        price: 2500,
        beds: 3,
        bathrooms: 2,
        carparks: 1,
        size: 1200,
        state: 'Selangor',
        city: 'Petaling Jaya',
        type: 'Apartment',
        imageUrl: 'https://znoujhfvqhcxwjlafcvf.supabase.co/storage/v1/object/public/property-images/property-images/3ee50ace-4d3a-4d4f-bc2e-57c0cf93296c.jpg',
        user_id: '123',
        created_at: '2024-01-01'
      },
      {
          property_id: '5',
          title: 'Modern Apartment in City Center5',
          price: 2500,
          beds: 3,
          bathrooms: 2,
          carparks: 1,
          size: 1200,
          state: 'Selangor',
          city: 'Petaling Jaya',
          type: 'Apartment',
          imageUrl: 'https://znoujhfvqhcxwjlafcvf.supabase.co/storage/v1/object/public/property-images/property-images/5df9e366-908f-4057-9c52-8f616b8b526e.jpg',
          user_id: '123',
          created_at: '2024-01-01'
        },
        {
          property_id: '6',
          title: 'Modern Apartment in City Center6',
          price: 2500,
          beds: 3,
          bathrooms: 2,
          carparks: 1,
          size: 1200,
          state: 'Selangor',
          city: 'Petaling Jaya',
          type: 'Apartment',
          imageUrl: 'https://znoujhfvqhcxwjlafcvf.supabase.co/storage/v1/object/public/property-images/property-images/4167cd0f-a32c-44a2-8789-1cab30c8eec6.jpg',
          user_id: '123',
          created_at: '2024-01-01'
        },
      
    
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const propertiesPerView = 3;
  const totalSlides = Math.ceil(dummyProperties.length / propertiesPerView);

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
                {dummyProperties
                  .slice(slideIndex * propertiesPerView, (slideIndex + 1) * propertiesPerView)
                  .map((property) => (
                    <div
                      key={property.property_id}
                      className="w-full"
                    >
                      <PropertyCard {...property} />
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