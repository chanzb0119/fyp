"use client";

// components/CustomGoogleMap.tsx
import React from 'react';
import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  address: string;
  lat: number;
  lng: number;
}

const CustomGoogleMap = ({ address, lat, lng }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const DEFAULT_ZOOM = 15;

  useEffect(() => {
    // Check if window.google is available
    if (!window.google || !mapRef.current) return;

    // Initialize the map
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: DEFAULT_ZOOM,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    // Add marker
    new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: address,
    });
  }, [address, lat, lng]);

  return (
    <div className="w-full h-[450px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default CustomGoogleMap;