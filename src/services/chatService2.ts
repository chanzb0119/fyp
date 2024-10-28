// src/services/chatService2.ts
import { claude } from '@/libs/claude';

export interface Message2 {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export class ChatService2 {
  async getResponse(userMessage: string): Promise<string> {
    try {
      const prompt = `Respond to this message with a single, short sentence: "${userMessage}"`;

      const response = await claude.complete(prompt);
      return response;
    } catch (error) {
      console.error('Chat error:', error);
      return "Opps";
    }
  }
}

export const chatService2 = new ChatService2();