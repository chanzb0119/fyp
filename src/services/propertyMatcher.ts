// src/services/propertyMatcher.ts
import { Property } from '@/libs/types/database';
import { claude } from './claude';

interface PropertyPreferences {
  location?: {
    city?: string;
    state?: string;
    nearbyKeywords?: string[];
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  beds?: number;
  bathrooms?: number;
  propertyType?: string;
  amenities?: string[];
  size?: {
    min?: number;
    max?: number;
  };
}

export class PropertyMatcher {
  async parseQuery(userMessage: string): Promise<PropertyPreferences> {
    const prompt = `Extract property search requirements from this query: "${userMessage}"
    Return a JSON object with these fields (only include mentioned criteria):
    {
      "location": {
        "city": string,
        "state": string,
        "nearbyKeywords": string[]
      },
      "priceRange": {
        "min": number,
        "max": number
      },
      "bedrooms": number,
      "bathrooms": number,
      "propertyType": string,
      "amenities": string[],
      "size": {
        "min": number,
        "max": number
      }
    }`;

    const response = await claude.complete(prompt);
    return JSON.parse(response);
  }

  matchProperties(properties: Property[], preferences: PropertyPreferences): Array<{
    explanation: string; property: Property; matchScore: number 
}> {
    return properties.map(property => ({
        explanation: "",
        property,
        matchScore: this.calculateMatchScore(property, preferences)
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
  }

  private calculateMatchScore(property: Property, preferences: PropertyPreferences): number {
    let score = 0;
    let criteriaCount = 0;

    // Location match
    if (preferences.location) {
      criteriaCount++;
      if (preferences.location.city && property.city.toLowerCase() === preferences.location.city.toLowerCase()) {
        score += 1;
      }
      if (preferences.location.state && property.state.toLowerCase() === preferences.location.state.toLowerCase()) {
        score += 0.5;
      }
    }

    // Price range match
    if (preferences.priceRange) {
      criteriaCount++;
      const price = property.price;
      if ((!preferences.priceRange.min || price >= preferences.priceRange.min) &&
          (!preferences.priceRange.max || price <= preferences.priceRange.max)) {
        score += 1;
      }
    }

    // Bedrooms match
    if (preferences.beds !== undefined) {
      criteriaCount++;
      if (property.beds === preferences.beds) {
        score += 1;
      }
    }

    // Bathrooms match
    if (preferences.bathrooms !== undefined) {
      criteriaCount++;
      if (property.bathrooms === preferences.bathrooms) {
        score += 1;
      }
    }

    // Property type match
    if (preferences.propertyType) {
      criteriaCount++;
      if (property.type.toLowerCase() === preferences.propertyType.toLowerCase()) {
        score += 1;
      }
    }

    // Amenities match
    if (preferences.amenities && preferences.amenities.length > 0) {
      criteriaCount++;
      const matchedAmenities = preferences.amenities.filter(amenity =>
        property.amenities.some(a => a.toLowerCase() === amenity.toLowerCase())
      );
      score += matchedAmenities.length / preferences.amenities.length;
    }

    // Size match
    if (preferences.size) {
      criteriaCount++;
      const size = property.size;
      if ((!preferences.size.min || size >= preferences.size.min) &&
          (!preferences.size.max || size <= preferences.size.max)) {
        score += 1;
      }
    }

    // Normalize score
    return criteriaCount > 0 ? score / criteriaCount : 0;
  }

  async explainMatch(property: Property, preferences: PropertyPreferences): Promise<string> {
    const prompt = `Explain why this property matches the user's preferences:
    
    Property:
    - ${property.title} in ${property.city}
    - RM${property.price} per month
    - ${property.beds} beds, ${property.bathrooms} bathrooms
    - ${property.size} sqft
    - Amenities: ${property.amenities.join(', ')}
    
    User Preferences:
    ${JSON.stringify(preferences, null, 2)}
    
    Provide a brief, natural explanation focusing on the matching criteria.
    Keep it to one or two sentences.`;

    return await claude.complete(prompt);
  }
}

export const propertyMatcher = new PropertyMatcher();