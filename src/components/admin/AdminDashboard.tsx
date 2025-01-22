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
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import PropertyReports from './PropertyReports';
import LandlordApplications from './LandlordApplications';
import UserManagement from './UserManagement';
import Overview from './Overview';

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
  
  // Redirect if user is not admin
  React.useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
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
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
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