"use client";

import React from 'react';
import { Heart, MessageCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { userService } from '@/services/user';
import { useEffect, useState } from 'react';
import { UserProfile } from '@/lib/types/database';
import { Skeleton } from '@/components/ui/skeleton';

interface StickyActionsProps {
  price: number;
  ownerId: string;
}

const StickyActions = ({ price, ownerId }: StickyActionsProps) => {
  const [owner, setOwner] = useState<Partial<UserProfile> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const ownerData = await userService.getUserById(ownerId);
        setOwner(ownerData);
      } catch (error) {
        console.error('Error fetching owner details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwner();
  }, [ownerId]);

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist');
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log('Report property');
  };

  const handleContact = () => {
    if (owner?.phone) {
      // Format phone number for WhatsApp URL
      const phoneNumber = owner.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    } else {
      console.log('No phone number available');
      // You might want to show a notification to the user
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 sticky top-8">
      {/* Price */}
      <div className="text-center pb-6 border-b">
        <span className="text-3xl font-bold text-blue-600">
          RM {price.toLocaleString()}
        </span>
        <span className="text-gray-600">/month</span>
      </div>

      {/* Owner Information */}
      <div className="flex items-center space-x-4 pb-6 border-b">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </>
        ) : owner ? (
          <>
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100">
              <Image
                src={owner.profile_image || '/api/placeholder/64/64'}
                alt={owner.name || 'Property Owner'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {owner.name || 'Property Owner'}
              </h3>
            </div>
          </>
        ) : (
          <div className="text-gray-500">Owner information not available</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToWishlist}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4" />
          Add to Wishlist
        </Button>
        
        <Button
          onClick={handleContact}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-800"
          disabled={!owner?.phone}
        >
          <MessageCircle className="w-4 h-4" />
          Contact via WhatsApp
        </Button>
        
        <Button
          onClick={handleReport}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
        >
          <Flag className="w-4 h-4" />
          Report Listing
        </Button>
      </div>
    </div>
  );
};

export default StickyActions;