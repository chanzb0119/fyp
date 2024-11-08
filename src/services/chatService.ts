import { supabase } from '@/libs/supabase/client';
import { claude } from './claude';
import { Property } from '@/libs/types/database';
import { locationInsightService } from './locationInsights';
import { ChatMode } from '@/libs/types/chat';

interface NearbyPlace {
  name: string;
  type: string;
  distance: number;
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

interface SearchQuery {
  location?: {
    city?: string;
    state?: string;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  bedrooms?: number;
  amenities?: string[];
  propertyType?: string;
}

export class ChatService {
  async getResponse(userMessage: string, mode: ChatMode, propertyId?: string): Promise<{
    content: string;
    matches?: Array<{ property: Property; matchScore: number;}>; locationInsights?: LocationInsights;
  }> {
    try {
      // Identify the intent of query
      if (mode === 'property_details' && propertyId) {
        return this.handlePropertyDetailsQuery(userMessage, propertyId);
      } else {
        return this.handleSearchQuery(userMessage);
      }
    } catch (error){
      console.error("Error in getResponse:", error);
      return{
        content: "I am having trouble processing your request. Could you please try again?"
      };
    }
  }

  private async handlePropertyDetailsQuery(message: string, propertyId: string) {
    // Get property details first
    const { data: property } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (!property) {
      return { content: "Sorry, I couldn't find the property details." };
    }

    // Determine if it's a location query
    const intent = await this.identifyQueryIntent(message);
    
    if (intent === 'location') {
      const insights = await locationInsightService.getLocationInsights(property);
      return {
        content: `Here's what I found about the area:`,
        locationInsights: insights
      };
    }

    // Answer property-specific questions
    const prompt = `Answer this question about the property:
    "${message}"

    Property details:
    - ${property.title} in ${property.city}
    - RM${property.price}/month
    - ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms
    - ${property.size} sqft
    - Amenities: ${property.amenities.join(', ')}

    Keep the answer natural and concise.`;

    const response = await claude.complete(prompt);
    return { content: response };
  }

  private async handleSearchQuery(userMessage: string) {
    const intent = await this.identifyQueryIntent(userMessage);
    // Your existing search logic
    if (intent === "search"){
      const searchCriteria = await this.parseSearchCriteria(userMessage);
      const hasEssentialCriteria = 
      (searchCriteria.location?.city || searchCriteria.location?.state) ||
      (searchCriteria.priceRange?.min || searchCriteria.priceRange?.max) ||
      searchCriteria.bedrooms;

      if (!hasEssentialCriteria) {
        // Generate follow-up question based on what's missing
        const missingCriteria = [];
        if (!searchCriteria.location?.city && !searchCriteria.location?.state) 
          missingCriteria.push("location");
        if (!searchCriteria.priceRange?.min && !searchCriteria.priceRange?.max) 
          missingCriteria.push("budget");
        if (!searchCriteria.bedrooms) 
          missingCriteria.push("number of bedrooms");

        return {
          content: `I can help you find a property. Could you please specify your preferred ${missingCriteria.join(", ")}? This will help me find the best matches for you.`
        };
      }

      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'published');

      // Apply filters based on search criteria
      if (searchCriteria.location?.city) {
        query = query.ilike('city', `%${searchCriteria.location.city}%`);
      }
      if (searchCriteria.location?.state) {
        query = query.ilike('state', `%${searchCriteria.location.state}%`);
      }
      if (searchCriteria.priceRange?.min) {
        query = query.gte('price', searchCriteria.priceRange.min);
      }
      if (searchCriteria.priceRange?.max) {
        query = query.lte('price', searchCriteria.priceRange.max);
      }
      if (searchCriteria.bedrooms) {
        query = query.eq('bedrooms', searchCriteria.bedrooms);
      }
      if (searchCriteria.propertyType) {
        query = query.ilike('type', `%${searchCriteria.propertyType}%`);
      }

      // Fetch matching properties
      const { data: properties, error } = await query;

      if (error) throw error;

      // Further filter for amenities (since we can't do array contains in Supabase)
      let matchingProperties = properties;
      if (searchCriteria.amenities && searchCriteria.amenities.length > 0) {
        matchingProperties = properties.filter(property =>
          searchCriteria.amenities!.some(amenity =>
            property.amenities.some((a: string) => 
              a.toLowerCase().includes(amenity.toLowerCase())
            )
          )
        );
      }

      // Get top matches (limit to 3)
      const topMatches = matchingProperties
        .slice(0, 3)
        .map(property => ({
          property,
          matchScore: 1, //  scoring system
        }));

      // Generate response based on results
      const responsePrompt = `Generate a brief response about the property search results.
      User query: "${userMessage}"
      Found ${topMatches.length} matching properties out of ${properties.length} total listings.
      ${topMatches.length === 0 ? 'Suggest refining the search criteria.' : ''}
      Only include information about the search results themselves.`;

      const content = await claude.complete(responsePrompt);

      return {
        content,
        matches: topMatches.length > 0 ? topMatches : undefined
      };
    }
    return {
      content: await claude.complete(`Respond to this message short: "${userMessage}"`)
    };
  }

  private async parseSearchCriteria(message: string): Promise<SearchQuery> {
    const prompt = `Extract property search criteria from this message: "${message}"
    Return a JSON object with only the mentioned criteria:
    {
      "location": {
        "city": string,
        "state": string
      },
      "priceRange": {
        "min": number,
        "max": number
      },
      "bedrooms": number,
      "amenities": string[],
      "propertyType": string
    }
    Only include fields that are explicitly mentioned or can be clearly inferred.`;

    try {
      const response = await claude.complete(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing search criteria:', error);
      return {};
    }
  }

  private async identifyQueryIntent(message: string): Promise<string> {
    const prompt = `Which type of intent is this query about? "${message}"
    Reply with just "search" | "location" | "other" `;
    return (await claude.complete(prompt)).toLowerCase();
  }

  private async extractLocationName(message: string): Promise<string | null> {
    const prompt = `Extract the location name from: "${message}"
    Reply with just the location name or "none" if no location is mentioned.`;
    const response = await claude.complete(prompt);
    return response.toLowerCase() === 'none' ? null : response;
  }

  
  private async extractPropertyReference(message: string): Promise<string | null> {
    // First check if we have a direct property ID reference
    const idMatch = message.match(/property\s*(?:id)?\s*[:#]?\s*([a-f0-9-]{36})/i);
    if (idMatch) {
      return idMatch[1];
    }

    // If no direct ID, try to identify property reference from context
    const prompt = `Extract property identifiers from this message: "${message}"
    Look for:
    1. Property titles
    2. Specific addresses
    3. Unique descriptions
    Reply with ONLY the property identifier or "none" if no specific property is referenced.
    Keep it very brief.`;

    const response = await claude.complete(prompt);
    
    if (response.toLowerCase().includes('none')) {
      return null;
    }

    // Try to find the property based on the extracted identifier
    const { data: properties } = await supabase
      .from('properties')
      .select('id, title')
      .or(`title.ilike.%${response}%,addressLine1.ilike.%${response}%`)
      .limit(1);

    return properties && properties.length > 0 ? properties[0].id : null;
  }
}

export const chatService = new ChatService();