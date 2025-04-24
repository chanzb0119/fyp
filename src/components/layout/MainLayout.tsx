"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { 
  Home, 
  Menu, 
  X, 
  Search, 
  LogIn,
  User, 
  LogOut, 
  PlusCircle, 
  Heart,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/user';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderProfileImage = () => {
    if (profileImage) {
      return (
        <div className="h-9 w-9 relative rounded-full overflow-hidden">
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
      <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center">
        <span className="text-white text-sm">
          {session?.user?.email?.[0]?.toUpperCase()}
        </span>
      </div>
    );
  };

  // Navigation links configuration
  const navLinks = [
    { 
      name: 'Home', 
      href: '/', 
      icon: <Home className="h-4 w-4 mr-1" /> 
    },
    { 
      name: 'Browse Properties', 
      href: '/properties', 
      icon: <Search className="h-4 w-4 mr-1" /> 
    },
    { 
      name: 'List Property', 
      href: '/properties/create', 
      icon: <PlusCircle className="h-4 w-4 mr-1" />,
      authRequired: true
    }
  ];

  // Filter links based on authentication status
  const filteredNavLinks = navLinks.filter(link => 
    !link.authRequired || (link.authRequired && status === 'authenticated')
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <header 
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Building2 className="h-7 w-7 text-blue-600" />
                <span className="ml-2 text-xl font-semibold">
                  RentalHome
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  )}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* User Profile or Login */}
            <div className="flex items-center">
              {status === 'authenticated' && session?.user ? (
                <div className="flex items-center">
                  {/* Wishlist Link */}
                  <Link
                    href="/profile?tab=wishlist"
                    className="flex items-center p-2 mr-2 rounded-full text-gray-700 hover:bg-gray-100"
                    title="Wishlist"
                  >
                    <Heart className="h-5 w-5" />
                  </Link>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        {renderProfileImage()}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex-shrink-0">
                          {renderProfileImage()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user.name || session.user.email}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link href="/profile?tab=wishlist" className="cursor-pointer flex items-center">
                          <Heart className="mr-2 h-4 w-4" />
                          <span>Wishlist</span>
                        </Link>
                      </DropdownMenuItem>
                      
                      {session.user.role === 'landlord' && (
                        <DropdownMenuItem asChild>
                          <Link href="/profile?tab=properties" className="cursor-pointer flex items-center">
                            <Building2 className="mr-2 h-4 w-4" />
                            <span>My Properties</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/login')}
                    className="hidden sm:flex items-center"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                  <Button 
                    onClick={() => router.push('/signup')}
                    className="ml-2"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="flex items-center md:hidden ml-4">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'
          } md:hidden`}
        >
          <div className="fixed inset-0 bg-black/25" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <Building2 className="h-8 w-auto text-blue-600" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-200">
                <div className="space-y-2 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center -mx-3 px-3 py-2 rounded-lg text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                <div className="py-6">
                  {status === 'authenticated' ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center -mx-3 px-3 py-2 rounded-lg text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5 mr-2" />
                        My Profile
                      </Link>
                      <Link
                        href="/profile?tab=wishlist"
                        className="flex items-center -mx-3 px-3 py-2 rounded-lg text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        Wishlist
                      </Link>
                      <button
                        className="flex w-full items-center -mx-3 px-3 py-2 rounded-lg text-base font-semibold leading-7 text-red-600 hover:bg-gray-50"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center -mx-3 px-3 py-2 rounded-lg text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LogIn className="h-5 w-5 mr-2" />
                        Login
                      </Link>
                      <div className="mt-4">
                        <Button
                          className="w-full"
                          onClick={() => {
                            router.push('/login');
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign Up
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="px-4 sm:px-6 lg:px-24 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-xl font-semibold">RentalHome</span>
              </Link>
              <p className="text-sm text-gray-500">
                Find your perfect rental property across Malaysia with personalized recommendations.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-gray-500 hover:text-blue-600">Home</Link></li>
                <li><Link href="/properties" className="text-sm text-gray-500 hover:text-blue-600">Browse Properties</Link></li>
                <li><Link href="/properties/create" className="text-sm text-gray-500 hover:text-blue-600">List Property</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Popular Locations</h3>
              <ul className="space-y-2">
                <li><Link href="/properties?state=Kuala%20Lumpur" className="text-sm text-gray-500 hover:text-blue-600">Kuala Lumpur</Link></li>
                <li><Link href="/properties?state=Penang" className="text-sm text-gray-500 hover:text-blue-600">Perak</Link></li>
                <li><Link href="/properties?state=Johor" className="text-sm text-gray-500 hover:text-blue-600">Johor</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Property Types</h3>
              <ul className="space-y-2">
                <li><Link href="/properties?type=Apartment" className="text-sm text-gray-500 hover:text-blue-600">Apartments</Link></li>
                <li><Link href="/properties?type=Condominium" className="text-sm text-gray-500 hover:text-blue-600">Condominiums</Link></li>
          
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            © {new Date().getFullYear()} RentalHome. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;