import { supabase } from '@/libs/supabase/client';
import { claude } from './claude';
import { Property } from '@/libs/types/database';

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
  async getResponse(userMessage: string): Promise<{
    content: string;
    matches?: Array<{ property: Property; matchScore: number; explanation?: string }>;
  }> {
    try {
      // First, check if this is a property search query
      const intentPrompt = `Determine if this is a property search query: "${userMessage}"
      Reply with just "yes" or "no"`;
      
      const isSearchQuery = (await claude.complete(intentPrompt)).toLowerCase().includes('yes');

      if (isSearchQuery) {
        // Parse search criteria from user message
        const searchCriteria = await this.parseSearchCriteria(userMessage);

      // Check if search criteria is too vague
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
        
        // Build Supabase query based on criteria
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

        // Generate explanations for matches
        // for (const match of topMatches) {
        //   match.explanation = await this.generateMatchExplanation(
        //     match.property,
        //     searchCriteria,
        //     userMessage
        //   );
        // }

        // Generate response based on results
        const responsePrompt = `Generate a brief, friendly response about the property search results.
        User query: "${userMessage}"
        Found ${topMatches.length} matching properties out of ${properties.length} total listings.
        ${topMatches.length === 0 ? 'Suggest refining the search criteria.' : ''}
        Keep it short and concise.`;

        const content = await claude.complete(responsePrompt);

        return {
          content,
          matches: topMatches.length > 0 ? topMatches : undefined
        };

      } else {
        // Handle non-search queries (prompt to be improved)
        const prompt = `Respond to this message short: "${userMessage}"`;

        return {
          content: await claude.complete(prompt)
        };
      }
    } catch (error) {
      console.error('Error in getResponse:', error);
      return {
        content: "I'm having trouble processing your request. Could you please try again?"
      };
    }
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

  private async generateMatchExplanation(
    property: Property,
    criteria: SearchQuery,
    originalQuery: string
  ): Promise<string> {
    const prompt = `Generate a brief explanation of why this property matches the user's search:
    
    Original query: "${originalQuery}"
    
    Property details:
    - ${property.title} in ${property.city}
    - RM${property.price} per month
    - ${property.bedrooms} bedrooms
    - Type: ${property.type}
    - Amenities: ${property.amenities.join(', ')}
    
    Search criteria: ${JSON.stringify(criteria)}
    
    Provide a natural, single-sentence explanation focused on the matching criteria.`;

    return await claude.complete(prompt);
  }
}

export const chatService = new ChatService();