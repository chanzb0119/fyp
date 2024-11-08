// components/PropertyMap.tsx
import { geocodeAddress } from '@/services/geocoding';
import React, { useEffect, useState } from 'react';
import CustomGoogleMap from '../CustomGoogleMap';

interface PropertyMapProps {
  address: string;
  latitude?: number;
  longitude?: number;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  address, 
  latitude: initialLat, 
  longitude: initialLng 
}) => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // If we already have coordinates, use them
        if (initialLat && initialLng && initialLat !== 0 && initialLng !== 0) {
          setCoordinates({ lat: initialLat, lng: initialLng });
          setIsLoading(false);
          return;
        }

        // Geocode the address
        const result = await geocodeAddress(address);
        
        if (result.success) {
          setCoordinates({
            lat: result.latitude,
            lng: result.longitude,
          });
        } else {
          setError(result.error || 'Failed to geocode address');
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load map');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [address, initialLat, initialLng]);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">{error || 'Unable to load map'}</div>
      </div>
    );
  }

  return (
    <CustomGoogleMap
      address={address}
      lat={coordinates.lat}
      lng={coordinates.lng}
    />
  );
};

export default PropertyMap;