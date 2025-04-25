// src/components/admin/Overview.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Users, Building2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalProperties: number;
  totalReports: number;
  pendingApplications: number;
  usersByRole: {
    role: string;
    count: number;
  }[];
  recentReports: {
    date: string;
    count: number;
  }[];
}

const Overview = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProperties: 0,
    totalReports: 0,
    pendingApplications: 0,
    usersByRole: [],
    recentReports: []
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadStats();
    
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const loadStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('user')
        .select('*', { count: 'exact' });

      // Get users by role
      const { data: usersByRole } = await supabase
        .from('user')
        .select('role')
        .not('role', 'is', null);

      const roleCounts = usersByRole?.reduce((acc: { [key: string]: number }, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      // Get total properties
      const { count: totalProperties } = await supabase
        .from('property')
        .select('*', { count: 'exact' });

      // Get total reports
      const { count: totalReports } = await supabase
        .from('report')
        .select('*', { count: 'exact' });

      // Get pending landlord applications
      const { count: pendingApplications } = await supabase
        .from('landlord_application')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      // Get recent reports (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentReports } = await supabase
        .from('report')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

      // Process recent reports data for chart
      const reportsByDay = recentReports?.reduce((acc: { [key: string]: number }, report) => {
        const date = new Date(report.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const recentReportsData = Object.entries(reportsByDay || {}).map(([date, count]) => ({
        date,
        count
      }));

      setStats({
        totalUsers: totalUsers || 0,
        totalProperties: totalProperties || 0,
        totalReports: totalReports || 0,
        pendingApplications: pendingApplications || 0,
        usersByRole: Object.entries(roleCounts || {}).map(([role, count]) => ({
          role,
          count: count as number
        })),
        recentReports: recentReportsData
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const StatCard = ({ title, value, icon, description }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    description?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Properties"
          value={stats.totalProperties}
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Reports"
          value={stats.totalReports}
          icon={<AlertTriangle className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Pending Apps"
          value={stats.pendingApplications}
          icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {isMobile ? (
                  // Pie chart for mobile view
                  <PieChart>
                    <Pie
                      data={stats.usersByRole}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="role"
                    >
                      {stats.usersByRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [value, 'Users']} />
                  </PieChart>
                ) : (
                  // Bar chart for desktop view
                  <BarChart data={stats.usersByRole}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Reports (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.recentReports}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;