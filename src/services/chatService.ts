// src/services/chatService.ts
import { claude } from '@/libs/claude';
import { Message, ChatContext, IntentAnalysis } from '@/libs/types/chat';
import { v4 as uuidv4 } from 'uuid';

export class ChatService {
  async identifyIntent(message: string): Promise<IntentAnalysis> {
    const prompt = `Analyze this property-related query and identify the user's intent and extract relevant parameters.
    Query: "${message}"
    
    Respond with JSON in this format:
    {
      "intent": "search" | "describe" | "question" | "match",
      "parameters": {
        "location": string (if mentioned),
        "priceRange": { "min": number, "max": number } (if mentioned),
        "bedrooms": number (if mentioned),
        "amenities": string[] (if mentioned),
        "nearbyPlaces": string[] (if mentioned)
      }
    }`;

    const response = await claude.complete(prompt);
    return JSON.parse(response);
  }

  async generateResponse(intent: IntentAnalysis, context: ChatContext): Promise<Message> {
    let content = '';

    switch (intent.intent) {
      case 'search':
        content = await this.generateSearchResponse(intent.parameters);
        break;
      case 'question':
        content = await this.generateQuestionResponse(intent.parameters, context);
        break;
      // ... other intent handlers
    }

    return {
      id: uuidv4(),
      role: 'assistant',
      content,
      timestamp: new Date()
    };
  }

  private async generateSearchResponse(parameters: any): Promise<string> {
    const prompt = `Generate a friendly response acknowledging a property search request with these parameters:
    ${JSON.stringify(parameters, null, 2)}
    
    Be conversational but concise. Confirm the understood requirements and mention that you'll look for matches.`;

    return await claude.complete(prompt);
  }

  private async generateQuestionResponse(parameters: any, context: ChatContext): Promise<string> {
    const prompt = `Answer this property-related question based on the context provided.
    Question parameters: ${JSON.stringify(parameters)}
    Current property: ${JSON.stringify(context.currentProperty)}
    Previous messages: ${JSON.stringify(context.conversationHistory.slice(-3))}
    
    Provide a helpful, natural-sounding response.`;

    return await claude.complete(prompt);
  }
}

export const chatService = new ChatService();