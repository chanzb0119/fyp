"use client";

import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Search, 
  MapPin, 
  Home,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types/database';
import PropertyCard from '../properties/PropertyCard';

// Sample data - Replace with API calls later
const RECOMMENDED_PROPERTIES :Property[] = [
  {
    property_id: '1',
    created_at: '2025-03-04 00:00:00+00',
    title: 'Central Residence @ Sungai Besi, Taman Tasik Pinggiran, Sungai Besi',
    type: 'Apartment',
    price: 2800,
    beds: 3,
    bathrooms: 2,
    carparks: 4,
    size: 1121,
    description: '',
    address: '',
    state: 'Kuala Lumpur',
    city: 'Sungai Besi',
    amenities: [],
    user_id: '777650f9-70a4-4a50-bed0-52cd8dc7099e',
    images: ["https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/3840x100000-fit/w-yvay123e7dd0-a8b6-41dc-bd62-392d62c3b35d_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg"],
    latitude: 0,
    longitude: 0,
    furnishing: ''
  },
  {
    property_id: '2',
    created_at: '2025-03-04 00:00:00+00',
    title: 'Central Residence @ Sungai Besi, Taman Tasik Pinggiran, Sungai Besi',
    type: 'Apartment',
    price: 2800,
    beds: 3,
    bathrooms: 2,
    carparks: 4,
    size: 1121,
    description: '',
    address: '',
    state: 'Kuala Lumpur',
    city: 'Sungai Besi',
    amenities: [],
    user_id: '777650f9-70a4-4a50-bed0-52cd8dc7099e',
    images: ["https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/3840x100000-fit/w-yvay123e7dd0-a8b6-41dc-bd62-392d62c3b35d_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg"],
    latitude: 0,
    longitude: 0,
    furnishing: ''
  },
  {
    property_id: '3',
    created_at: '2025-03-04 00:00:00+00',
    title: 'Central Residence @ Sungai Besi, Taman Tasik Pinggiran, Sungai Besi',
    type: 'Apartment',
    price: 2800,
    beds: 3,
    bathrooms: 2,
    carparks: 4,
    size: 1121,
    description: '',
    address: '',
    state: 'Kuala Lumpur',
    city: 'Sungai Besi',
    amenities: [],
    user_id: '777650f9-70a4-4a50-bed0-52cd8dc7099e',
    images: ["https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/3840x100000-fit/w-yvay123e7dd0-a8b6-41dc-bd62-392d62c3b35d_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-mj9k0aed862f-1192-4a5b-a714-27ec27599ac4_2560x1920.jpeg","https://img.iproperty.com.my/my-iproperty/premium/486x492-crop/w-1bymc77c155c-d7c2-4b70-b6d5-a3a9cbda145c_2560x1920.jpeg"],
    latitude: 0,
    longitude: 0,
    furnishing: ''
  }
];

const POPULAR_LOCATIONS = [
  { name: 'Kuala Lumpur', count: 253, image: '/api/placeholder/220/140' },
  { name: 'Perak', count: 184, image: '/api/placeholder/220/140' },
  { name: 'Johor', count: 176, image: '/api/placeholder/220/140' },
];

const PROPERTY_TYPES = [
  { name: 'All Residential', value: 'All Residential' },
  { name: 'Apartment', value: 'Apartment' },
  { name: 'Condominium', value: 'Condominium' },
  { name: 'Terrace House', value: 'Terrace House' },
  { name: 'Semi-D', value: 'Semi-D' },
  { name: 'Bungalow', value: 'Bungalow' }
];

const BEDROOMS_OPTIONS = [
  { name: 'Any', value: '' },
  { name: '1', value: '1' },
  { name: '2', value: '2' },
  { name: '3', value: '3' },
  { name: '4+', value: '4' }
];

export default function LandingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchParams, setSearchParams] = useState({
    state: '',
    searchTerm: '',
    propertyType: 'All Residential',
    minRent: '',
    maxRent: '',
    builtUpSize: '',
    bedrooms: ''
  });

  useEffect(() => {
    if (session?.user.role === "admin") {
      router.push('/admin');
    }
  }, [session, router]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="relative ">
        {/* Background with overlay gradient */}
        <div className="relative h-[700px] bg-cover bg-center lg:px-44" style={{ 
          backgroundImage: 'url(/landing-background.jpg)'
        }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          
          <div className="relative max-w-7xl mx-auto px-4 pt-32 sm:px-6 lg:px-8 space-y-8">
            {/* Hero Text */}
            <div className="text-center text-white space-y-4 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Find Your Perfect Rental Home
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                Discover properties across Malaysia with personalized recommendations
              </p>
            </div>
            
            {/* Search Container */}
            <div className="bg-white/75 backdrop-blur-sm rounded-3xl shadow-xl p-6 mx-auto max-w-4xl">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Top Row - State and Search */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* State selector */}
                  <select
                    value={searchParams.state}
                    onChange={(e) => setSearchParams({...searchParams, state: e.target.value})}
                    className="md:w-1/4 h-12 border rounded-xl focus:ring-2 focus:ring-blue-500 px-3"
                  >
                    <option value="">All States</option>
                    <option value="Johor">Johor</option>
                    <option value="Kedah">Kedah</option>
                    <option value="Kelantan">Kelantan</option>
                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                    <option value="Melaka">Melaka</option>
                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                    <option value="Pahang">Pahang</option>
                    <option value="Perak">Perak</option>
                    <option value="Perlis">Perlis</option>
                    <option value="Penang">Penang</option>
                    <option value="Sabah">Sabah</option>
                    <option value="Sarawak">Sarawak</option>
                    <option value="Selangor">Selangor</option>
                    <option value="Terengganu">Terengganu</option>
                  </select>
                  
                  {/* Search input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by location, property name, or keyword"
                      value={searchParams.searchTerm}
                      onChange={(e) => setSearchParams({...searchParams, searchTerm: e.target.value})}
                      className="pl-10 w-full h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <select
                    value={searchParams.propertyType}
                    onChange={(e) => setSearchParams({...searchParams, propertyType: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.name}</option>
                    ))}
                  </select>

                  <select
                    value={searchParams.bedrooms}
                    onChange={(e) => setSearchParams({...searchParams, bedrooms: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                  >
                    <option value="">Bedrooms</option>
                    {BEDROOMS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.name}</option>
                    ))}
                  </select>

                  <Input
                    type="number"
                    placeholder="Min Rent (RM)"
                    value={searchParams.minRent}
                    onChange={(e) => setSearchParams({...searchParams, minRent: e.target.value})}
                    className="w-full rounded-xl"
                  />

                  <Input
                    type="number"
                    placeholder="Max Rent (RM)"
                    value={searchParams.maxRent}
                    onChange={(e) => setSearchParams({...searchParams, maxRent: e.target.value})}
                    className="w-full rounded-xl"
                  />
                </div>

                {/* Search Button */}
                <div className="flex justify-center">
                  <Button 
                    type="submit"
                    className="w-full md:w-auto px-8 py-6 rounded-xl text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
                  >
                    Search Properties
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-10 bg-white px-20 lg:px-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Finding your ideal rental property is easy with our simple 3-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-5 mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
              <p className="text-gray-600">
                Use filters to find properties that match your criteria
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-5 mb-4">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Listings</h3>
              <p className="text-gray-600">
                Explore detailed property information, photos, and location details
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-5 mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contact Landlords</h3>
              <p className="text-gray-600">
                Connect directly with verified landlords to arrange viewings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Properties Section */}
      <div className="py-10 bg-gray-100 px-20 lg:px-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recommended Listings</h2>
            <Link 
              href="/properties" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RECOMMENDED_PROPERTIES.map((property) => (
              <PropertyCard
                        key={property.property_id}
                        {...property}
                        imageUrl={property.images?.[0] || ''}
                    />
            ))}
          </div>
        </div>
      </div>

      {/* Popular Locations Section */}
      <div className="py-10 bg-white px-20 lg:px-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Popular Locations</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover rental properties in these sought-after areas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POPULAR_LOCATIONS.map((location) => (
              <Link
                href={`/properties?state=${location.name}`}
                key={location.name}
                className="group relative rounded-xl overflow-hidden h-48"
              >
                <div className="absolute inset-0 bg-gray-500">
                  <Image 
                    src={location.image} 
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={220}
                    height={140}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-bold mb-1">{location.name}</h3>
                  <p className="text-white/90 text-sm flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {location.count} properties
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-10 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to list your property?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of landlords who trust our platform to find reliable tenants
          </p>
          <Button 
            onClick={() => router.push('/properties/create')}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-medium rounded-xl"
          >
            List Your Property
          </Button>
        </div>
      </div>
    </div>
  );
}