/* eslint-disable @next/next/no-img-element */
//src\components\properties\create\PropertyForm.tsx

"use client";  

import React, { useState, useCallback, useEffect } from 'react';
import { Building2, Home, Info, Upload, X } from 'lucide-react';
import { propertyService } from '@/services/properties';
import { uploadImage } from '@/services/image-upload';
import { stateAndCities } from '@/lib/constant/malaysiaStates';
import Link from 'next/link';
import AddressAutocomplete from './AddressAutocomplete';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PropertyFormData {
  title: string;
  type: string;
  price: string;
  beds: string;
  bathrooms: string;
  carparks: string;
  size: string;
  description: string;
  address: string;
  state: string;
  city: string;
  amenities: string[];
  images: string[];
  latitude: number;
  longitude: number;
  furnishing: string;
}

const PropertyForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState<PropertyFormData>({
      title: '',
      type: '',
      price: '',
      beds: '',
      bathrooms: '',
      size: '',
      description: '',
      address: '',
      state: '',
      city: '',
      amenities: [],
      images: [],
      latitude: 0,
      longitude: 0,
      furnishing: '',
      carparks: ''
    });
      
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  const propertyTypes: string[] = [
    'Apartment',
    'Condominium',
    '1-sty Terrace/Link House',
    '1.5-sty Terrace/Link House',
    '2-sty Terrace/Link House',
    '3-sty Terrace/Link House',
    'Serviced Residence',
    'Semi-detached House',
    'Bungalow',
  ];

  const amenitiesList: string[] = [
    'WiFi',
    'Air Conditioning',
    'Badminton Court',
    'Gym',
    'Swimming Pool',
    '24hr Security',
    'Playground',
    'Washer/Dryer',
    'Barbecue Area',
    'Nursery',
    'Sauna',
    'Squash Court',
    'Jacuzzi',
    'Jogging Track',
    'Cafeteria',
    'Mini Market'
  ];

  const states = Object.keys(stateAndCities)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { city: ""} : {})
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Store the File objects separately
      setImageFiles(prev => [...prev, ...files]);

      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      setError('Please sign in to create a listing');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Upload images first
      const uploadedUrls = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const url = await uploadImage(imageFiles[i]);
        uploadedUrls.push(url);
        setUploadProgress(((i + 1) / imageFiles.length) * 100);
      }

      const propertyData = {
        title: formData.title,
        type: formData.type,
        price: parseFloat(formData.price),
        beds: parseInt(formData.beds),
        bathrooms: parseInt(formData.bathrooms),
        carparks: parseInt(formData.carparks),
        size: parseFloat(formData.size),
        description: formData.description,
        address: formData.address,
        state: formData.state,
        city: formData.city,
        amenities: formData.amenities,
        user_id: session.user.id,
        images: uploadedUrls,
        latitude: formData.latitude,
        longitude: formData.longitude,
        furnishing: formData.furnishing
      };

      await propertyService.createProperty(propertyData);
      alert('Property created successfully!');
      // Reset form
      setFormData({
        title: '',
        type: '',
        price: '',
        beds: '',
        bathrooms: '',
        carparks: '',
        size: '',
        description: '',
        address: '',
        state: '',
        city: '',
        amenities: [],
        images: [],
        latitude: 0,
        longitude: 0,
        furnishing: '',
      });
      setImageFiles([]); // Reset image files
      setPreviews([]);   // Reset previews
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  if (status === "loading") {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Please sign in to create a listing</p>
        <Link 
          href="/login"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Info className="h-5 w-5" />
            Basic Information
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Select type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Property Details
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Monthly Rent (RM)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Beds
              </label>
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size {"("}sqft{")"}
              </label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
             {/* Furnishing Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Furnishing Status
                </label>
                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select furnishing status</option>
                  <option value="Fully furnished">Fully furnished</option>
                  <option value="Partially furnished">Partially furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              {/* Carparks */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Carparks
                </label>
                <input
                  type="number"
                  name="carparks"
                  value={formData.carparks}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Home className="h-5 w-5" />
            Location
          </h2>

          {/* Add Google Places Autocomplete here */}
          <div className="mt-4 mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Search Address
            </label>
            <AddressAutocomplete onSelect={(details) => {
              setFormData(prev => ({
                ...prev,
                address: details.address,
                state: details.state,
                city: details.city,
                latitude: details.latitude,
                longitude: details.longitude,
              }));
            }} />
            {formData.latitude !== 0 && (
              <p className="mt-1 text-sm text-gray-500">
                Location coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
            )}
          </div>
  
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              name="addressLine1"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select state</option>
                  {states.map((state) => (
                  <option key={state} value={state}>
                      {state}
                  </option>
                  ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select city</option>
                  {formData.state && stateAndCities[formData.state]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                  ))}
                </select>
            </div>
             
            </div>

        </div>

        {/* Amenities */}
        <div>
          <h2 className="text-xl font-semibold">Amenities</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300"
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Property Images
        </h2>
        
        <div className="space-y-4">
          <label className="block">
            <span className="sr-only">Choose images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 cursor-pointer
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </label>

          {/* Image previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3">
              {previews.map((preview, index) => (
                <div 
                  key={`${preview}-${index}`} 
                  className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover rounded-lg transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 transform group-hover:scale-110"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {isSubmitting && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md text-white ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;