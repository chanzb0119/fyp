import { Property } from "./database";

// src/types/chat.ts
export type MessageRole = 'user' | 'assistant';
export type ChatIntent = 'search' | 'describe' | 'question' | 'match';

export interface PropertySearchParams {
    location?: string;
    priceRange?: {
      min?: number;
      max?: number;
    };
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    amenities?: string[];
    nearbyPlaces?: string[];
    maxDistance?: number;  // in kilometers
  }

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  properties?: Property[];
}

export interface ChatContext {
  currentProperty?: Property;
  searchParams?: PropertySearchParams;
  conversationHistory: Message[];
}

export interface IntentAnalysis {
  intent: ChatIntent;
  parameters: {
    location?: string;
    priceRange?: {
      min?: number;
      max?: number;
    };
    bedrooms?: number;
    amenities?: string[];
    [key: string]: any;
  };
}