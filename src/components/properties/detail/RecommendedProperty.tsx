"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from '../PropertyCard';
import { Property } from '@/lib/types/database';
import { useSession } from 'next-auth/react';

interface RecommendedPropertiesProps {
  propertyId: string;
  userId?: string;
}

const RecommendedProperties = ({ propertyId }: RecommendedPropertiesProps) => {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const propertiesPerView = 3;
  const totalSlides = Math.ceil(properties.length / propertiesPerView);


  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dummy properties
        // const recommendedProperties: Property[] = [
        //   {
        //     property_id: '1',
        //     created_at: '2025-03-04 00:00:00+00',
        //     title: 'Central Residence @ Sungai Besi, Taman Tasik Pinggiran, Sungai Besi',
        //     type: 'Apartment',
        //     price: 2800,
        //     beds: 3,
        //     bathrooms: 2,
        //     carparks: 4,
        //     size: 1121,
        //     description: '',
        //     address: '',
        //     state: 'Kuala Lumpur',
        //     city: 'Sungai Besi',
        //     amenities: [],
        //     user_id: '777650f9-70a4-4a50-bed0-52cd8dc7099e',
        //     images: ["https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/3840x100000-fit/w-yvay123e7dd0-a8b6-41dc-bd62-392d62c3b35d_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg"],
        //     latitude: 0,
        //     longitude: 0,
        //     furnishing: ''
        //   },
        //   {
        //     property_id: '2',
        //     created_at: '2025-03-04 00:00:00+00',
        //     title: 'Central Residence @ Sungai Besi, Taman Tasik Pinggiran, Sungai Besi',
        //     type: 'Apartment',
        //     price: 2800,
        //     beds: 3,
        //     bathrooms: 2,
        //     carparks: 4,
        //     size: 1121,
        //     description: '',
        //     address: '',
        //     state: 'Kuala Lumpur',
        //     city: 'Sungai Besi',
        //     amenities: [],
        //     user_id: '777650f9-70a4-4a50-bed0-52cd8dc7099e',
        //     images: ["https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/3840x100000-fit/w-yvay123e7dd0-a8b6-41dc-bd62-392d62c3b35d_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg"],
        //     latitude: 0,
        //     longitude: 0,
        //     furnishing: ''
        //   },
        //   {
        //     property_id: '3',
        //     created_at: '2025-03-04 00:00:00+00',
        //     title: 'Central Residence @ Sungai Besi, Taman Tasik Pinggiran, Sungai Besi',
        //     type: 'Apartment',
        //     price: 2800,
        //     beds: 3,
        //     bathrooms: 2,
        //     carparks: 4,
        //     size: 1121,
        //     description: '',
        //     address: '',
        //     state: 'Kuala Lumpur',
        //     city: 'Sungai Besi',
        //     amenities: [],
        //     user_id: '777650f9-70a4-4a50-bed0-52cd8dc7099e',
        //     images: ["https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/3840x100000-fit/w-yvay123e7dd0-a8b6-41dc-bd62-392d62c3b35d_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg"],
        //     latitude: 0,
        //     longitude: 0,
        //     furnishing: ''
        //   },
        //   {
        //     property_id: '4',
        //     created_at: '2025-03-04 00:00:00+00',
        //     title: 'Central Residence @ Sungai Besi, Taman Tasik Pinggiran, Sungai Besi',
        //     type: 'Apartment',
        //     price: 2800,
        //     beds: 3,
        //     bathrooms: 2,
        //     carparks: 4,
        //     size: 1121,
        //     description: '',
        //     address: '',
        //     state: 'Kuala Lumpur',
        //     city: 'Sungai Besi',
        //     amenities: [],
        //     user_id: '777650f9-70a4-4a50-bed0-52cd8dc7099e',
        //     images: ["https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/3840x100000-fit/w-yvay123e7dd0-a8b6-41dc-bd62-392d62c3b35d_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg"],
        //     latitude: 0,
        //     longitude: 0,
        //     furnishing: ''
        //   },
        //   {
        //     property_id: '5',
        //     created_at: '2025-03-04 00:00:00+00',
        //     title: 'Central Residence @ Sungai Besi, Taman Tasik Pinggiran, Sungai Besi',
        //     type: 'Apartment',
        //     price: 2800,
        //     beds: 3,
        //     bathrooms: 2,
        //     carparks: 4,
        //     size: 1121,
        //     description: '',
        //     address: '',
        //     state: 'Kuala Lumpur',
        //     city: 'Sungai Besi',
        //     amenities: [],
        //     user_id: '777650f9-70a4-4a50-bed0-52cd8dc7099e',
        //     images: ["https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/3840x100000-fit/w-yvay123e7dd0-a8b6-41dc-bd62-392d62c3b35d_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg"],
        //     latitude: 0,
        //     longitude: 0,
        //     furnishing: ''
        //   },
        //   {
        //     property_id: '6',
        //     created_at: '2025-03-04 00:00:00+00',
        //     title: 'Central Residence @ Sungai Besi, Taman Tasik Pinggiran, Sungai Besi',
        //     type: 'Apartment',
        //     price: 2800,
        //     beds: 3,
        //     bathrooms: 2,
        //     carparks: 4,
        //     size: 1121,
        //     description: '',
        //     address: '',
        //     state: 'Kuala Lumpur',
        //     city: 'Sungai Besi',
        //     amenities: [],
        //     user_id: '777650f9-70a4-4a50-bed0-52cd8dc7099e',
        //     images: ["https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/3840x100000-fit/w-yvay123e7dd0-a8b6-41dc-bd62-392d62c3b35d_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg"],
        //     latitude: 0,
        //     longitude: 0,
        //     furnishing: ''
        //   }
        // ]

        
        // If user is logged in, get personalized recommendations
        if (session?.user?.id) {
          // const response = await fetch('/api/recommendations', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({
          //     userId: session.user.id,
          //     limit: 6
          //   }),
          // });

          const response = await fetch('/api/hybrid-recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              propertyId: propertyId,
              userId: session.user.id,
              limit: 6
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to load recommendations');
          }
          
          const data = await response.json();
          setProperties(data.recommendations);
        } else {
          // For non-logged in users, get similar properties based on current property
          const response = await fetch('/api/similar-properties', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              propertyId,
              limit: 6
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to load similar properties');
          }
          
          const data = await response.json();
          setProperties(data.similarProperties);
        }
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [propertyId, session]);

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
    <div className="mt-12 mb-10 lg:px-12">
      <h2 className="text-2xl font-semibold mb-6 pl-4">Other properties you may interest</h2>
      
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
                className="w-full flex-none grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-3"
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