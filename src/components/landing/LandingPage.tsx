// src\components\landing\LandingPage.tsx
"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PropertyCard from '@/components/properties/PropertyCard';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

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
  
  const router = useRouter();
  const [searchParams, setSearchParams] = React.useState({
    state: '',
    searchTerm: '',
    propertyType: 'All Residential',
    minRent: '',
    maxRent: '',
    builtUpSize: '',
    bedrooms: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert search params to URL query string
    const queryString = new URLSearchParams();
    if (searchParams.state !== '') queryString.append('state', searchParams.state);
    if (searchParams.searchTerm !== '') queryString.append('q', searchParams.searchTerm);
    if (searchParams.propertyType !== 'All Residential') queryString.append('type', searchParams.propertyType);
    if (searchParams.minRent !== '') queryString.append('minPrice', searchParams.minRent);
    if (searchParams.maxRent !== '') queryString.append('maxPrice', searchParams.maxRent);
    if (searchParams.builtUpSize !== '') queryString.append('size', searchParams.builtUpSize);
    if (searchParams.bedrooms !== '') queryString.append('beds', searchParams.bedrooms);
    
    const url = `/properties?${queryString.toString()}`;
    router.push(url);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <div className="relative h-[600px] bg-cover bg-center" style={{ 
        backgroundImage: 'url(/landing-background.jpg)'
      }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-3xl mx-auto px-4 pt-32 sm:px-6 lg:px-8">
          {/* Search Container */}
          <div className="bg-white/80 rounded-3xl shadow-lg p-6 mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">
              Find Your  Rental Property
            </h1>
            
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Top Row - State and Search */}
              <div className="flex gap-4">
                {/* State selector - takes up approximately 1/4 of the space */}
                <select
                    value={searchParams.state}
                    onChange={(e) => setSearchParams({...searchParams, state: e.target.value})}
                    className="w-1/4 h-10 border rounded-lg focus:ring-2 focus:ring-blue-500 shrink-0 px-3"
                >
                    <option value="">All States</option>
                    {/* ... options ... */}
                </select>
                
                {/* Search input - takes up the remaining space */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                    type="text"
                    placeholder="Search by Locations or Property name"
                    value={searchParams.searchTerm}
                    onChange={(e) => setSearchParams({...searchParams, searchTerm: e.target.value})}
                    className="pl-10 w-full h-10"
                    />
                </div>
                </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={searchParams.propertyType}
                  onChange={(e) => setSearchParams({...searchParams, propertyType: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="All Residential">All Residential</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Condominium">Condominium</option>
                  <option value="Terrace House">Terrace House</option>
                  <option value="Semi-D">Semi-D</option>
                  <option value="Bungalow">Bungalow</option>
                </select>

                <select
                  value={searchParams.bedrooms}
                  onChange={(e) => setSearchParams({...searchParams, bedrooms: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Bedrooms</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>

                <Input
                  type="number"
                  placeholder="Min Rent (RM)"
                  value={searchParams.minRent}
                  onChange={(e) => setSearchParams({...searchParams, minRent: e.target.value})}
                  className="w-full"
                />

                <Input
                  type="number"
                  placeholder="Max Rent (RM)"
                  value={searchParams.maxRent}
                  onChange={(e) => setSearchParams({...searchParams, maxRent: e.target.value})}
                  className="w-full"
                />
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <Button 
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  Search Properties
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Recommended Properties Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
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