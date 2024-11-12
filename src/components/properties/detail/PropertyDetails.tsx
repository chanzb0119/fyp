

// src\components\properties\detail\PropertyDetails.tsx
import React from 'react';
import { 
  Bed, 
  Bath, 
  Square,
  MapPin,
  Car
} from 'lucide-react';
import PropertyMap from './PropertyMap';
import Description from './Description';
import ImageGallery from './ImageGallery';

interface PropertyDetailsProps {
  property: {
    latitude: number | undefined;
    longitude: number | undefined;
    id: string;
    title: string;
    type: string;
    price: number;
    beds: number;
    bathrooms: number;
    size: number;
    description: string;
    address: string;
    state: string;
    city: string;
    amenities: string[];
    images: string[];
    created_at: string;
    furnishing: string;
    carparks: number;
  };
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {

  return (
    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 ">
      {/* Image Gallery */}
      <ImageGallery images={property.images} title={property.title} />

      {/* Property Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{property.city + ", " + property.state}</span>
              </div>
            </div>

            {/* Key Features */}
            <div className="flex items-center gap-6 py-4 border-y">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-gray-600" />
                <span>{property.beds} </span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-gray-600" />
                <span>{property.bathrooms} </span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-gray-600" />
                <span>{property.carparks == 0 ? "-": property.carparks}</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="h-5 w-5 text-gray-600" />
                <span>{property.size} sqft</span>
              </div>
              <div className="flex items-center gap-2">
                Furnishing: {property.furnishing == null? "Not mentioned":property.furnishing}
              </div>
            </div>

            {/* Description */}
            <Description text={property.description} />

            {/* Amenities */}
            <div className='py-4 border-y'>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <PropertyMap
                address={`${property.address}, ${property.city}, ${property.state}`}
                latitude={property.latitude}
                longitude={property.longitude}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 sticky top-8">
            <div className="text-center pb-6 border-b">
              <span className="text-3xl font-bold text-blue-600">
                RM {property.price.toLocaleString()}
              </span>
              <span className="text-gray-600">/month</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Property Type</span>
                <span className="font-medium">{property.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Listed Date</span>
                <span className="font-medium">
                  {property.created_at}
                </span>
              </div>
            </div>

            {/* Contact buttons would go here in future */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Contact Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;