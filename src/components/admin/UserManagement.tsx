// src/components/admin/UserManagement.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { 
  Search, 
  User as UserIcon,
  Shield,
  Home,
  Ban,
  Check
} from 'lucide-react';
import Image from 'next/image';

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  email_verified: boolean;
  profile_image: string | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;
      
      await loadUsers();
      setShowDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Admin</Badge>;
      case 'landlord':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Landlord</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">User</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = selectedRole === 'all' || user.role.toLowerCase() === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="landlord">Landlords</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                        {user.profile_image ? (
                          <Image
                            src={user.profile_image}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <UserIcon className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {user.email_verified ? (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-300">
                        Unverified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDialog(true);
                      }}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Management Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User</DialogTitle>
            <DialogDescription>
              Change user role or manage account status
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  {selectedUser.profile_image ? (
                    <Image
                      src={selectedUser.profile_image}
                      alt={selectedUser.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Change Role</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={selectedUser.role === 'user' ? 'default' : 'outline'}
                      className="flex items-center gap-2"
                      onClick={() => handleRoleChange(selectedUser.user_id, 'user')}
                    >
                      <UserIcon className="w-4 h-4" />
                      User
                    </Button>
                    <Button
                      variant={selectedUser.role === 'landlord' ? 'default' : 'outline'}
                      className="flex items-center gap-2"
                      onClick={() => handleRoleChange(selectedUser.user_id, 'landlord')}
                    >
                      <Home className="w-4 h-4" />
                      Landlord
                    </Button>
                    <Button
                      variant={selectedUser.role === 'admin' ? 'default' : 'outline'}
                      className="flex items-center gap-2"
                      onClick={() => handleRoleChange(selectedUser.user_id, 'admin')}
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Account Status</h4>
                  <p className="text-sm">
                    {selectedUser.email_verified ? (
                      <span className="flex items-center gap-2 text-green-600">
                        <Check className="w-4 h-4" />
                        Email verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-yellow-600">
                        <Ban className="w-4 h-4" />
                        Email not verified
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;