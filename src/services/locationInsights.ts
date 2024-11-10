/* eslint-disable @typescript-eslint/no-explicit-any */
import { Property } from '@/libs/types/database';
import { claude } from './claude';

interface NearbyPlace {
  name: string;
  type: string;
  distance: number; // in meters
  rating?: number;
}

interface LocationInsights {
  nearbyPlaces: {
    education: NearbyPlace[];
    food: NearbyPlace[];
    transport: NearbyPlace[];
    shopping: NearbyPlace[];
    healthcare: NearbyPlace[];
  };
  areaAnalysis: string;
  suitableFor: string[];
}

export class LocationInsightService {
  private GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!;

  async getNearbyPlaces(latitude: number, longitude: number, type: string, radius: number = 2000) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${this.GOOGLE_API_KEY}`
    );

    const data = await response.json();
    return data.results.map((place: any) => ({
      name: place.name,
      type: place.types[0],
      distance: place.geometry ? 
        this.calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng) 
        : 0,
      rating: place.rating
    }));
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula to calculate distance
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // place types: https://developers.google.com/maps/documentation/places/web-service/supported_types
  async getLocationInsights(property: Property): Promise<LocationInsights> {
    const [education, food, transport, shopping, healthcare] = await Promise.all([
      this.getNearbyPlaces(property.latitude, property.longitude, 'school'),
      this.getNearbyPlaces(property.latitude, property.longitude, 'restaurant'),
      this.getNearbyPlaces(property.latitude, property.longitude, 'transit_station'),
      this.getNearbyPlaces(property.latitude, property.longitude, 'shopping_mall'),
      this.getNearbyPlaces(property.latitude, property.longitude, 'hospital')
    ]);

    const insights = {
      nearbyPlaces: {
        education: education.slice(0, 5),
        food: food.slice(0, 5),
        transport: transport.slice(0, 5),
        shopping: shopping.slice(0, 5),
        healthcare: healthcare.slice(0, 5)
      },
      areaAnalysis: '',
      suitableFor: []
    };

    // Generate area analysis using Claude
    const analysisPrompt = `Analyze this location based on nearby places:
    Education: ${insights.nearbyPlaces.education.map((p: { name: any; distance: any; }) => `${p.name} (${p.distance}m)`).join(', ')}
    Food: ${insights.nearbyPlaces.food.map((p: { name: any; distance: any; }) => `${p.name} (${p.distance}m)`).join(', ')}
    Transport: ${insights.nearbyPlaces.transport.map((p: { name: any; distance: any; }) => `${p.name} (${p.distance}m)`).join(', ')}
    Shopping: ${insights.nearbyPlaces.shopping.map((p: { name: any; distance: any; }) => `${p.name} (${p.distance}m)`).join(', ')}
    Healthcare: ${insights.nearbyPlaces.healthcare.map((p: { name: any; distance: any; }) => `${p.name} (${p.distance}m)`).join(', ')}

    Property Details:
    - Located in ${property.city}, ${property.state}
    - RM${property.price}/month
    - ${property.beds} beds

    Provide a brief analysis of:
    1. Area convenience
    2. Suitable tenant types (students, families, professionals)
    3. Key advantages of the location
    Keep it concise and factual.`;

    insights.areaAnalysis = await claude.complete(analysisPrompt);

    return insights;
  }
}

export const locationInsightService = new LocationInsightService();