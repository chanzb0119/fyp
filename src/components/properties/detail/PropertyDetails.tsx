"use client";

import React, { useEffect } from 'react';
import { 
  Bed, 
  Bath, 
  Square,
  MapPin,
  Car,
  Building2,
  Calendar
} from 'lucide-react';
import PropertyMap from './PropertyMap';
import Description from './Description';
import ImageGallery from './ImageGallery';
import { format } from 'date-fns';
import StickyActions from './StickyAction';
import RecommendedProperties from './RecommendedProperty';
import { supabase } from '@/lib/supabase/client';
import { useSession } from 'next-auth/react';

interface PropertyDetailsProps {
  property: {
    latitude: number | undefined;
    longitude: number | undefined;
    property_id: string;
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
    user_id: string;
  };
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {

  const { data: session } = useSession();

  // Track property view when component mounts
  useEffect(() => {
    const trackPropertyView = async () => {
      // Only track view if user is logged in
      if (session?.user?.id) {
        try {
          // Add small random delay to avoid double-triggering in development
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const userId = session.user.id;
          const propertyId = property.property_id;
          const viewKey = `property_view_${propertyId}_${userId}`;
          const lastViewTime = localStorage.getItem(viewKey);
          const currentTime = Date.now();
          
          // Check if user has viewed this property in the last 30 minutes
          if (!lastViewTime || (currentTime - parseInt(lastViewTime)) > 30 * 60 * 1000) {
            // Record the view in Supabase
            await supabase.from('event').insert({
              property_id: propertyId,
              user_id: userId,
              event: 'view'
            });
            
            // Update the last view time
            localStorage.setItem(viewKey, currentTime.toString());
          }
        } catch (error) {
          console.error('Error tracking view:', error);
        }
      }
    };
    
    trackPropertyView();
  }, [property.property_id, session?.user?.id]);
  
  const formattedDate = format(new Date(property.created_at), 'MMMM d, yyyy');

  return (
    <div className="max-w-7xl mx-auto sm:px-4 lg:px-28">
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

            {/* Property Type and Listed Date - Moved from sticky container */}
            <div className="flex flex-wrap gap-4 mt-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{property.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Listed on {formattedDate}</span>
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

        {/* Sticky Sidebar */}
        <div className="lg:col-span-1">
          <StickyActions
            propertyId={property.property_id}
            price={property.price}
            ownerId={property.user_id}
          />
        </div>
      </div>

      {/* Recommended Properties */}
      <RecommendedProperties 
        propertyId={property.property_id}
        userId={""} // TODO: Pass the current user's ID from session
      />
    </div>
  );
};

export default PropertyDetails;