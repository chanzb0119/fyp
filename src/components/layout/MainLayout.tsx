"use client";
// src\components\layout\MainLayout.tsx

import React, { ReactNode, useEffect, useState } from 'react';
import { Home, Plus, User, Store, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { userService } from '@/services/user';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (session?.user?.id) {
        try {
          const userData = await userService.getUserById(session.user.id);
          setProfileImage(userData.profile_image || null);
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      }
    };

    fetchProfileImage();
  }, [session?.user?.id]);


  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderProfileImage = () => {
    if (profileImage) {
      return (
        <div className="h-10 w-10 relative rounded-full overflow-hidden">
          <Image
            src={profileImage}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
      );
    }

    return (
      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
        <span className="text-white text-sm">
          {session?.user?.email?.[0]?.toUpperCase()}
        </span>
      </div>
    );
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Home className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-xl font-semibold">
                  Rental Platform
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              {status === 'authenticated' && session?.user ? (
                <>
                  <Link
                    href="/properties"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <Store className="h-5 w-5 mr-1.5" />
                    Browse Properties
                  </Link>
                  
                  <Link
                    href="/properties/create"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <Plus className="h-5 w-5 mr-1.5" />
                    List Property
                  </Link>

                  {/* User Profile and Logout group */}
                  <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200"> 
                    <DropdownMenu onOpenChange={setIsDropdownOpen}>
                      <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none group">
                        {renderProfileImage()}
                        <ChevronDown 
                          className={`h-4 w-4 text-gray-600 transition-transform duration-200 ease-in-out ${
                            isDropdownOpen ? 'rotate-180' : ''
                          } group-hover:text-blue-600`}
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={() => router.push('/profile')}
                          className="cursor-pointer flex items-center space-x-2"
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleLogout}
                          className="cursor-pointer text-red-600 focus:text-red-600 flex items-center space-x-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/properties"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <Store className="h-5 w-5 mr-1.5" />
                    Browse Properties
                  </Link>
                  
                  <Link
                    href="/login"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <User className="h-5 w-5 mr-1.5" />
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 Rental Property Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;