"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { Home, Plus, User, Store, LogOut, ChartLine} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/libs/supabase/client';
import { User as SupabaseUser}  from '@supabase/supabase-js'
import Image from 'next/image';

interface MainLayoutProps {
  children: ReactNode;
}

interface UserMetadata {
  avatar_url?: string;
  email?: string;
  full_name?: string;
  [key: string]: unknown;
}

interface CustomUser extends SupabaseUser {
  user_metadata: UserMetadata;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) =>{
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16"> {/* Added items-center here */}
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
            <div className="flex items-center space-x-4"> {/* Changed space-x-2 to space-x-4 and added items-center */}
              {user? (
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
                    {/*User icon*/}
                    {user.user_metadata?.avatar_url ? (
                      <div className="h-10 w-10 relative rounded-full overflow-hidden">
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-sm">
                          {user.email?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      <LogOut className="h-5 w-5 mr-1.5" />
                      Logout
                    </button>
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
                    href="/analysis"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <ChartLine className="h-5 w-5 mr-1.5" />
                    Market Analysis
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