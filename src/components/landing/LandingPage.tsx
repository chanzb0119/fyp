import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import PropertyCard from '@/components/properties/PropertyCard';

export default function LandingPage() {
  const recommendedProperties = [
    {
      id: '1',
      title: 'Apartment1',
      description: '1',
      imageUrl: '/api/placeholder/400/300',
      type: 'Apartment'
    },
    {
      id: '2',
      title: 'House1',
      description: '1',
      imageUrl: '/api/placeholder/400/300',
      type: 'House'
    },
    {
      id: '3',
      title: 'House3',
      description: '1',
      imageUrl: '/api/placeholder/400/300',
      type: 'Loft'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <div className="relative h-[600px] bg-cover bg-center" style={{ 
        backgroundImage: 'url(/landing-background.jpg)'
      }}>
        <div className="absolute inset-0 bg-black/40" /> {/* Darker overlay for better contrast */}
        <div className="relative max-w-3xl mx-auto px-4 pt-32 sm:px-6 lg:px-8">
          {/* Search Container */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">
              Find Your Dream Rental
            </h1>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="City, Neighborhood, Address"
                className="w-full pr-20"
              />
              <Button 
                className="absolute right-0 top-0 rounded-l-none h-full bg-[#c9e01d] hover:bg-[#b5ca1a] text-black"
              >
                Search
              </Button>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6 justify-center">
              <div className="flex items-center space-x-2">
                <Checkbox id="pet" />
                <label htmlFor="pet" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Pet
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="parking" />
                <label htmlFor="parking" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Parking
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="furnished" />
                <label htmlFor="furnished" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Furnished
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Properties Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8">Recommended Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-48">
                <img 
                  src={property.imageUrl} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                <p className="text-gray-600 text-sm">{property.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}