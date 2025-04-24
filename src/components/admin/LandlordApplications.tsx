// src/components/admin/LandlordApplications.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { FileText, CheckCircle, XCircle } from 'lucide-react';


interface LandlordApplication {
  app_id: string;
  user_id: string;
  status: string;
  documents: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
}

const LandlordApplications = () => {
  const [applications, setApplications] = useState<LandlordApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<LandlordApplication | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('landlord_application')
        .select(`
          *,
          user:user_id (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      // Update application status
      const { error: applicationError } = await supabase
        .from('landlord_application')
        .update({ status: newStatus })
        .eq('app_id', applicationId);

      if (applicationError) throw applicationError;

      // If approved, update user role to landlord
      if (newStatus === 'approved' && selectedApp) {
        const { error: userError } = await supabase
          .from('user')
          .update({ role: 'landlord' })
          .eq('user_id', selectedApp.user_id);

        if (userError) throw userError;
      }

      // Refresh applications list
      await loadApplications();
      setShowDialog(false);
      setSelectedApp(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-300">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.app_id}>
                  <TableCell>
                    {format(new Date(app.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{app.user?.name}</TableCell>
                  <TableCell>{app.user?.email}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApp(app);
                          setShowDialog(true);
                        }}
                      >
                        Review
                      </Button>
                      <a
                        href={app.documents}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {applications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No applications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Review Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Review the landlord application and make a decision
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="font-medium">Applicant Details</p>
                <p>Name: {selectedApp.user?.name}</p>
                <p>Email: {selectedApp.user?.email}</p>
                <p>Applied: {format(new Date(selectedApp.created_at), 'PPpp')}</p>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Submitted Documents</p>
                <a
                  href={selectedApp.documents}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Document
                </a>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            {selectedApp?.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleStatusUpdate(selectedApp.app_id, 'rejected')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedApp.app_id, 'approved')}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandlordApplications;