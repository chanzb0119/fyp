"use client"

// src\components\properties\detail\Description.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Description = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const MAX_HEIGHT = 275;

  useEffect(() => {
    if (textRef.current) {
      setShowButton(textRef.current.scrollHeight > MAX_HEIGHT);
    }
  }, [text]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Description</h2>
      <div className="relative">
        {/* Text container with smooth height transition */}
        <div 
          className={`relative overflow-hidden transition-all duration-300 ease-in-out`}
          style={{ 
            maxHeight: isExpanded ? `${textRef.current?.scrollHeight || 1000}px` : `${MAX_HEIGHT}px`
          }}
        >
          <p
            ref={textRef}
            className="text-gray-600 whitespace-pre-line"
          >
            {text}
          </p>
          
          {/* Gradient overlay with fade transition */}
          {!isExpanded && showButton && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent transition-opacity duration-300" />
          )}
        </div>
        
        {/* Button container with animated chevron */}
        {showButton && (
          <div className="relative z-10 mt-2 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium focus:outline-none transition-all duration-300 group"
            >
              <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
              <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Description;