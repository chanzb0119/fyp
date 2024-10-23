// src/components/properties/MapView.tsx
"use client";

import { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Share2 } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  images: string[];
  type: string;
}

interface MapViewProps {
  properties: Property[];
}

const MapView = ({ properties }: MapViewProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Center map on Malaysia
  const defaultCenter = {
    lat: 3.140853,
    lng: 101.693207
  };

  const [currentCenter, setCurrentCenter] = useState(defaultCenter);

  // Helper function to zoom to property
  const zoomToProperty = (property: Property) => {
    if (map) {
      map.panTo({ lat: property.latitude, lng: property.longitude });
      map.setZoom(16); // Increase zoom level when property is selected
    }
  };

  const defaultZoom = 17;

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  
  return (
    <div className="flex h-[calc(100vh-64px)]"> {/* Subtract navbar height */}
      {/* Property List */}
      <div className="w-1/3 overflow-y-auto p-4 bg-white border-r">
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedProperty(property);
                map?.panTo({ lat: property.latitude, lng: property.longitude });
              }}
            >
              {/* Property Card */}
              <div className="relative h-48">
                <Image
                  src={property.images[0] || '/placeholder.jpg'}
                  alt={property.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 space-x-2">
                  <button className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                  {property.type}
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">RM {property.price.toLocaleString()}/month</h3>
                    <p className="text-gray-600">
                      {property.bedrooms} Beds • {property.bathrooms} Baths • {property.size} sqft
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  {property.addressLine1}, {property.city}, {property.state}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="w-2/3">
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={defaultCenter}
          zoom={defaultZoom}
          onLoad={setMap}
          options={mapOptions}
        >
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={{ lat: property.latitude, lng: property.longitude }}
              onClick={() => {
                setSelectedProperty(property);
                zoomToProperty(property);
                setCurrentCenter({
                    lat: property.latitude,
                    lng: property.longitude
                  });
              }}
              label={{
                text: `RM ${property.price.toLocaleString()}`,
                className: 'marker-label'
              }}
            />
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{
                lat: selectedProperty.latitude,
                lng: selectedProperty.longitude
              }}
              onCloseClick={() => {
                setSelectedProperty(null);
                // Keep the current center and zoom level
                if(map){
                    map.setCenter(currentCenter);
                }
              }}
            >
              <div className="w-[280px]"> {/* Fixed width for more square appearance */}
                <div className="aspect-[4/3] relative w-full mb-3">
                  <Image
                    src={selectedProperty.images[0] || '/placeholder.jpg'}
                    alt={selectedProperty.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 space-x-2">
                    <button className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm">
                    {selectedProperty.type}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    RM {selectedProperty.price.toLocaleString()}/month
                  </h3>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <span>{selectedProperty.bedrooms} Beds</span>
                    <span>•</span>
                    <span>{selectedProperty.bathrooms} Baths</span>
                    <span>•</span>
                    <span>{selectedProperty.size} sqft</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {selectedProperty.addressLine1},
                    <br />
                    {selectedProperty.city}, {selectedProperty.state}
                  </p>
                  <Link
                    href={`/properties/${selectedProperty.id}`}
                    className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapView;