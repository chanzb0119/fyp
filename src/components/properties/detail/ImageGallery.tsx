"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';

const ImageGallery = ({ images, title }: { images: string[], title: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsAnimating(false), 250); // Match this with CSS transition duration
  };

  const previousImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 250); // Match this with CSS transition duration
  };

  return (
    <div className="max-w-4xl mx-auto mb-8"> {/* Reduced max width */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
        {images.length > 0 ? (
          <div className="relative w-full h-full">
            {/* Current Image */}
            <div
              className={`absolute w-full h-full transition-opacity duration-400  ${
                isAnimating ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <Image
                src={images[currentImageIndex]}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Previous image"
                  disabled={isAnimating}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Next image"
                  disabled={isAnimating}
                >
                  <ChevronRight className="h-5 w-5 text-gray-800" />
                </button>
              </>
            )}

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrentImageIndex(index);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  disabled={isAnimating}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">No images available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;