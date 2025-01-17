"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Phone, Mail, Camera } from 'lucide-react';
import Image from 'next/image';
import { uploadImage } from '@/services/image-upload';
import { Property, UserProfile } from '@/lib/types/database';
import { propertyService } from '@/services/properties';
import PropertyCard from '@/components/properties/PropertyCard';
import { userService } from '@/services/user';
import LandlordApplication from './LandlordApplication';
import ApplicationStatus from './ApplicationStatus';
import SuccessDialog from './SucessDialog';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [wishlist, setWishlist] = useState<Property[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<{
    status: string;
    createdAt: string;
    documentUrl?: string;
  } | null>(null);

  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    profile_image: '',
    role: 'user',
    user_id: '',
    created_at: '',
    updated_at: '',
    email_verified: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    } else if (session?.user) {
        loadProfileData()
        loadUserProperties();
        loadWishlist();

        const loadApplicationStatus = async () => {
          if (session?.user?.id && profileData.role !== 'landlord') {
            try {
              const status = await userService.getLandlordApplicationStatus(session.user.id);
              if (status) {
                setApplicationStatus(status);
              }
            } catch (error) {
              console.error('Error loading application status:', error);
            }
          }
        };
      
        loadApplicationStatus();
    }
  }, [session, status, router]);

  const loadProfileData = async () => {
    try {
      if (session?.user?.id) {
        const userProfile = await userService.getUserById(session.user.id);
        if (userProfile) {
          setProfileData({
            user_id: userProfile.user_id || '',
            name: userProfile.name || '',
            email: userProfile.email || '',
            phone: userProfile.phone || '',
            profile_image: userProfile.profile_image || '',
            //role: userProfile.role || 'user',
            role: 'user',
            created_at: userProfile.created_at || '',
            updated_at: userProfile.updated_at || '',
            email_verified: userProfile.email_verified || false,
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadUserProperties = async () => {
    try {
        if(session?.user.id){
            const properties = await propertyService.getPropertiesByUserId(session.user.id);
            setUserProperties(properties);
        }      
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const loadWishlist = async () => {
      try {
        if(session?.user.id){
            const wishlists = await userService.getWishlist(session.user.id);
            setWishlist(wishlists);
        }      
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log("test");
      if (!profileData.user_id) {
        throw new Error('User ID is missing');
      }

      // Create an updates object with only the fields we want to update
      const updates: Partial<UserProfile> = {
        name: profileData.name || '',
        phone: profileData.phone || '',
        profile_image: profileData.profile_image,
        updated_at: new Date().toISOString()
      };
      
      const updatedProfile = await userService.updateProfile(profileData.user_id, updates);
      
      setProfileData(prev => ({
        ...prev,
        ...updatedProfile,
        updated_at: new Date().toISOString()
      }));
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(`Failed to update profile, error: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      setIsLoading(true);
      const imageUrl = await uploadImage(e.target.files[0]);
      setProfileData(prev => ({ ...prev, profile_image: imageUrl }));
    } catch (err) {
      setError(`Failed to upload image, error: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[550px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="properties">
            {profileData.role === 'landlord' ? 'My Properties' : 'Become a Landlord'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="profile-form" onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={profileData.profile_image || '/api/placeholder/96/96'}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <label 
                      htmlFor="profile-image" 
                      className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Camera className="h-4 w-4 text-gray-600" />
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                  <Alert>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="pl-9 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+60 12-345-6789"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="profile-form" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((property) => (
              <PropertyCard imageUrl={property.images[0]} key={property.property_id} {...property} />
            ))}
            {wishlist.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Your wishlist is empty.</p>
                <Button
                  onClick={() => router.push('/properties')}
                  className="mt-4"
                >
                  Browse Properties
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="properties">
            {profileData.role === 'landlord' ? (
              // Existing properties grid for landlords
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProperties.map((property) => (
                  <PropertyCard imageUrl={property.images[0]} key={property.property_id} {...property} />
                ))}
                {userProperties.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">You haven&apos;t listed any properties yet.</p>
                    <Button
                      onClick={() => router.push('/properties/create')}
                      className="mt-4"
                    >
                      Create Your First Listing
                    </Button>
                  </div>
                )}
              </div>
            ) : applicationStatus ? (
              // Show application status if user has applied
              <ApplicationStatus {...applicationStatus} />
            ) : (
              // Landlord application section for regular users
              <LandlordApplication 
                onApply={async (documentFile) => {
                  try {
                    if(!profileData.user_id){
                      throw new Error("Missing user id");
                    }
                    setIsLoading(true);
                    await userService.applyForLandlord(profileData.user_id, documentFile);
                    setShowSuccessDialog(true);

                    const status = await userService.getLandlordApplicationStatus(profileData.user_id);
                    setApplicationStatus(status);
                  } catch (error) {
                    console.error('Error applying for landlord:', error);
                    setError('Failed to submit landlord application');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                isLoading={isLoading}
              />
            )}
          </TabsContent>

          <SuccessDialog 
            isOpen={showSuccessDialog} 
            onClose={() => setShowSuccessDialog(false)} 
          />
        
      </Tabs>
    </div>
  );
};

export default ProfilePage;