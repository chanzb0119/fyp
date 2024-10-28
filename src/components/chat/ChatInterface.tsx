// src/components/chat/ChatInterface.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { Message, ChatContext } from '@/libs/types/chat';
import { chatService } from '@/services/chatService';
import { v4 as uuidv4 } from 'uuid';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ChatContext>({
    conversationHistory: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Process message

      const intent = await chatService.identifyIntent(message);
      const response = await chatService.generateResponse(intent, {
        ...context,
        conversationHistory: [...messages, userMessage]
      });

      // Add assistant message
      
      setMessages(prev => [...prev, response]);
      setContext(prev => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory, userMessage, response]
      }));
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold">Property Assistant</h3>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 italic">Assistant is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <form
          onSubmit={e => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
            handleSubmit(input.value);
            input.value = '';
          }}
        >
          <input
            type="text"
            name="message"
            placeholder="Ask about properties..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}