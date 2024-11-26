"use client";
// src\components\layout\MainLayout.tsx

import React, { ReactNode } from 'react';
import { Home, Plus, User, Store, LogOut } from 'lucide-react';
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

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
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
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center space-x-2">
                        {session.user.image ? (
                          <div className="h-10 w-10 relative rounded-full overflow-hidden">
                            <Image
                              src={session.user.image}
                              alt="Profile"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-sm">
                              {session.user.email?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                          Logout
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