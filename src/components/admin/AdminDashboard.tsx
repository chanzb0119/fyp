// src/components/admin/AdminDashboard.tsx
"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Shield, 
  Flag, 
  LayoutDashboard,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import PropertyReports from './PropertyReports';
import LandlordApplications from './LandlordApplications';
import UserManagement from './UserManagement';
import Overview from './Overview';
import { cn } from '@/lib/utils';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const menuItems: MenuItem[] = [
  {
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: 'Overview',
    value: 'overview'
  },
  {
    icon: <Shield className="w-4 h-4" />,
    label: 'Landlord Applications',
    value: 'applications'
  },
  {
    icon: <Flag className="w-4 h-4" />,
    label: 'Reports',
    value: 'reports'
  },
  {
    icon: <Users className="w-4 h-4" />,
    label: 'User Management',
    value: 'users'
  }
];

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Redirect if user is not admin
  React.useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setMobileMenuOpen(false);
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar for desktop / Mobile overlay menu */}
      <div 
        className={cn(
          "md:w-64 bg-white md:relative fixed inset-0 z-30 transition-all duration-300 ease-in-out",
          mobileMenuOpen 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-full md:opacity-100 md:translate-x-0"
        )}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        <div className="p-6 md:pt-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="px-4 space-y-2 pb-6">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => handleTabChange(item.value)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === item.value
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <Button
            variant="ghost"
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 justify-start font-normal"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </nav>
      </div>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Mobile tab selector */}
          <div className="md:hidden mb-6">
            <select 
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            >
              {menuItems.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {activeTab === 'overview' && <Overview />}
          {activeTab === 'applications' && <LandlordApplications />}
          {activeTab === 'reports' && <PropertyReports />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;