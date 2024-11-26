//src\components\properties\PropertyCard.tsx

"use client";

import React from 'react';
import { Bed, Bath, Square, MapPin, Car, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

interface PropertyCardProps {
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

const PropertyCard = ({ 
  property_id,
  title, 
  price, 
  beds, 
  bathrooms, 
  carparks,
  size, 
  state,
  city, 
  type,
  imageUrl,
  user_id,
  created_at
}: PropertyCardProps) => {
  const { user } = useUser();

  const isOwner = user?.id === user_id;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <Link href={`/properties/${property_id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Property Image */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl || '/api/placeholder/400/300'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
          {type}
        </div>
        {isOwner && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
          Your Property
        </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
        
        <div className="mt-1">
          <span className="text-xl font-bold text-blue-600">
            RM {price.toLocaleString()}
          </span>
          <span className="text-gray-500 text-sm">/month</span>
        </div>

        {/* Listed date */}
        <div className="mt-1 items-center text-gray-800 flex gap-1">
          <Calendar className="w-3 h-3" />
          <span className="text-sm">Posted on: {formatDate(created_at)}</span>
        </div>

        {/* Features */}
        <div className="mt-4 flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span className="text-sm">{beds}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="w-4 h-4" />
            <span className="text-sm">{carparks == 0? "-" : carparks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span className="text-sm">{size} sqft</span>
          </div>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-start gap-1 text-gray-500">
          <MapPin className="w-4 h-4 mt-0.5" />
          <span className="text-sm truncate">{city + ", " + state}</span>
        </div>

        
      </div>
    </Link>
  );
};

export default PropertyCard;