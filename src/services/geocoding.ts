/* eslint-disable @typescript-eslint/no-explicit-any */
// src\services\geocoding.ts
interface GeocodeResult {
    latitude: number;
    longitude: number;
    success: boolean;
    error?: string;
  }
  
export const geocodeAddress = async (address: string): Promise<GeocodeResult> => {
    try {
        // Ensure the Geocoding API is loaded
        if (!window.google) {
        throw new Error('Google Maps API not loaded');
        }

        const geocoder = new window.google.maps.Geocoder();

        return new Promise((resolve) => {
        geocoder.geocode({ address }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            resolve({
                latitude: location.lat(),
                longitude: location.lng(),
                success: true,
            });
            } else {
            resolve({
                latitude: 0,
                longitude: 0,
                success: false,
                error: `Geocoding failed: ${status}`,
            });
            }
        });
        });
    } catch (error: any) {
        return {
        latitude: 0,
        longitude: 0,
        success: false,
        error: `Geocoding error: ${error.message}`,
        };
    }
};