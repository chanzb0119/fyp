"use client";

import { useEffect, useState } from 'react';
import { chatService } from '@/services/chatService';
import { X, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/libs/types/database';
import Link from 'next/link';
import { ChatMode } from '@/libs/types/chat';

interface ChatInterfaceProps {
  mode: ChatMode;
  propertyId?: string;
}

interface NearbyPlace {
  name: string;
  type: string;
  distance: number;
  rating?: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  matches?: Array<{
    property: Property;
    matchScore: number;
  }>;
  locationInsights?: LocationInsights;
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

export default function ChatInterface({ mode, propertyId }: ChatInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    const initialMessage: Message = mode === 'search' 
      ? {
          id: '1',
          role: 'assistant',
          content: 'Hi! How can I help you find a property? You can ask me things like "Find an apartment in Kampar under RM500"'
        }
      : {
          id: '1',
          role: 'assistant',
          content: 'Hi! I can help you learn more about this property. Feel free to ask about the area, amenities, or any other details!'
        };
    
    setMessages([initialMessage]);
  }, [mode, propertyId]); // Reset chat when mode or propertyId changes

  

  const handleSubmit = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userInput
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.getResponse(userInput, mode, propertyId);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.content,
        matches: response.matches,
        locationInsights: response.locationInsights
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Floating chat button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[400px] max-h-[600px] bg-white rounded-xl shadow-xl border overflow-hidden flex flex-col z-30">
      {/* Header */}
      <div className="px-4 py-3 bg-blue-600 text-white flex justify-between items-center shrink-0">
        <h3 className="font-semibold">Property Assistant</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-blue-700 rounded-full"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map(message => (
          <div key={message.id} className="space-y-4">
            {/* Message Bubble */}
            <div
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white shadow-sm'
                }`}
              >
                {message.content}
              </div>
            </div>

            {/* Property Matches */}
            {message.matches && message.matches.length > 0 && (
              <div className="space-y-3">
                {message.matches.map(match => (
                  <Link 
                    href={`/properties/${match.property.id}`}
                    key={match.property.id}
                    className="block bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 shrink-0">
                        <Image
                          src={match.property.images[0]}
                          alt={match.property.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">{match.property.title}</h4>
                        <p className="text-sm text-gray-600">
                          RM {match.property.price.toLocaleString()}/month
                        </p>
                        <p className="text-sm text-gray-600">
                          {match.property.beds} Beds • {match.property.bathrooms} Baths
                        </p>
                        
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Location Insights */}
            {message.locationInsights && (
              <div className="mt-4 bg-white rounded-lg p-4 shadow-sm space-y-4">
                {/* Area Analysis */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Area Analysis</h4>
                  <p className="text-sm text-gray-600">{message.locationInsights.areaAnalysis}</p>
                </div>
                
                {/* Nearby Places */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Nearby Places</h4>
                  {Object.entries(message.locationInsights.nearbyPlaces).map(([category, places]) => 
                    places.length > 0 && (
                      <div key={category} className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700 capitalize">{category}</h5>
                        <ul className="space-y-1">
                          {places.map((place, index) => (
                            <li key={index} className="text-sm text-gray-600 flex justify-between">
                              <span className="flex items-center">
                                {place.name}
                                {place.rating && (
                                  <span className="ml-2 text-yellow-500">★ {place.rating}</span>
                                )}
                              </span>
                              <span>{Math.round(place.distance)}m</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm p-3 rounded-2xl">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
            handleSubmit(input.value);
            input.value = '';
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            name="message"
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}