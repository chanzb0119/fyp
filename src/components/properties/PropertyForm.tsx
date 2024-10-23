"use client";  // Add this at the very top of the file

import React, { useState, useCallback } from 'react';
import { Building2, Home, Info, Upload, X } from 'lucide-react';
import { propertyService } from '@/services/properties';
import { uploadImage } from '@/libs/utils/image-upload';
import { stateAndCities } from '@/libs/constant/malaysiaStates';
import { useUser } from '@/hooks/useUser';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

interface PropertyFormData {
    title: string;
    type: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    size: string;
    description: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    city: string;
    amenities: string[];
    images: File[];
}

const PropertyForm = () => {
  const { user } = useUser()

  const [formData, setFormData] = useState<PropertyFormData>({
      title: '',
      type: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      size: '',
      description: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      amenities: [],
      images: [],
    });
      
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const propertyTypes: string[] = [
    'Apartment',
    'House',
    'Condo',
    'Townhouse',
    'Studio',
    'Room',
  ];

  const amenitiesList: string[] = [
    'WiFi',
    'Air Conditioning',
    'Parking',
    'Gym',
    'Swimming Pool',
    'Security',
    'Furnished',
    'Washer/Dryer',
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
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));

      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please sign in to create a listing');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Upload images first
      const uploadedUrls = [];
      for (let i = 0; i < formData.images.length; i++) {
        const url = await uploadImage(formData.images[i]);
        uploadedUrls.push(url);
        setUploadProgress(((i + 1) / formData.images.length) * 100);
      }

      const propertyData = {
        title: formData.title,
        type: formData.type,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        size: parseFloat(formData.size),
        description: formData.description,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        state: formData.state,
        city: formData.city,
        amenities: formData.amenities,
        user_id: user.id,
        status: 'published' as const,
        images: uploadedUrls,
      };

      await propertyService.createProperty(propertyData);
      alert('Property created successfully!');
      // Reset form
      setFormData({
        title: '',
        type: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        size: '',
        description: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        amenities: [],
        images: [],
      });
      setPreviews([]);
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
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
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
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
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
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
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Home className="h-5 w-5" />
            Location
          </h2>
  
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Address Line 1
            </label>
            <input
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Address Line 2
            </label>
            <input
              name="addressLine2"
              value={formData.addressLine2}
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