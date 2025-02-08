// src/services/recommendation.ts

const RECOMMENDATION_API_URL = process.env.NEXT_PUBLIC_RECOMMENDATION_API_URL || 'http://127.0.0.1:8000';

export const recommendationService = {
  async getContentBasedRecommendations(propertyId: string, limit: number = 5) {
    try {
      const response = await fetch(`${RECOMMENDATION_API_URL}/recommendations/content-based`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get content-based recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting content-based recommendations:', error);
      return [];
    }
  },

  async getCollaborativeRecommendations(userId: string, limit: number = 5) {
    try {
      const response = await fetch(`${RECOMMENDATION_API_URL}/recommendations/collaborative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get collaborative recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting collaborative recommendations:', error);
      return [];
    }
  },
};