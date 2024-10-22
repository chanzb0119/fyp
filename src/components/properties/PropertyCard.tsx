"use client";

import React from 'react';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  state: string;
  city: string;
  type: string;
  imageUrl: string;
}

const PropertyCard = ({ 
  id,
  title, 
  price, 
  bedrooms, 
  bathrooms, 
  size, 
  state,
  city, 
  type,
  imageUrl 
}: PropertyCardProps) => {
  return (
    <Link href={`/properties/${id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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

        {/* Features */}
        <div className="mt-4 flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span className="text-sm">{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span className="text-sm">{size} sqft</span>
          </div>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-start gap-1 text-gray-500">
          <MapPin className="w-4 h-4 mt-0.5" />
          <span className="text-sm truncate">{state + ", " + city}</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;