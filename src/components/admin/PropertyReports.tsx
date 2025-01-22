// src/components/admin/PropertyReports.tsx
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
import { 
  Eye,
  Trash2,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import Image from 'next/image';
import { propertyService } from '@/services/properties';

interface Report {
  report_id: string;
  property_id: string;
  user_id: string;
  category: string;
  description: string;
  image_urls: string[];
  created_at: string;
  user: {
    name: string;
    email: string;
  };
  property: {
    title: string;
    user_id: string;
  };
}

interface ReportsTableProps {
  reports: Report[];
  getCategoryBadge: (category: string) => React.ReactNode;
  onReviewReport: (report: Report) => void;
}

const ReportsTable = ({ reports, getCategoryBadge, onReviewReport }: ReportsTableProps) => (
  <Card>
    <CardContent className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.report_id}>
              <TableCell>
                {format(new Date(report.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>{getCategoryBadge(report.category)}</TableCell>
              <TableCell>{report.user?.name}</TableCell>
              <TableCell>{report.property?.title}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReviewReport(report)}
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {reports.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No reports found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const PropertyReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('report')
        .select(`
          *,
          user:user_id (
            name,
            email
          ),
          property:property_id (
            title,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await propertyService.deleteProperty(propertyId);
      
      // Delete all reports for this property
      const { error } = await supabase
        .from('report')
        .delete()
        .eq('property_id', propertyId);

      if (error) throw error;
      
      setShowDialog(false);
      setSelectedReport(null);
      loadReports();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('report')
        .delete()
        .eq('report_id', reportId);

      if (error) throw error;
      
      setShowDialog(false);
      setSelectedReport(null);
      loadReports();
    } catch (error) {
      console.error('Error dismissing report:', error);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case 'inappropriate content':
        return <Badge variant="destructive">Inappropriate</Badge>;
      case 'fraudulent listing':
        return <Badge variant="destructive">Fraud</Badge>;
      case 'inaccurate information':
        return <Badge variant="outline">Inaccurate</Badge>;
      case 'spam':
        return <Badge variant="outline">Spam</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="inappropriate">Inappropriate Content</TabsTrigger>
          <TabsTrigger value="fraudulent">Fraudulent Listings</TabsTrigger>
          <TabsTrigger value="inaccurate">Inaccurate Information</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ReportsTable 
            reports={reports} 
            getCategoryBadge={getCategoryBadge}
            onReviewReport={(report) => {
              setSelectedReport(report);
              setShowDialog(true);
            }}
          />
        </TabsContent>

        <TabsContent value="inappropriate">
          <ReportsTable 
            reports={reports.filter(r => r.category.toLowerCase() === 'inappropriate content')}
            getCategoryBadge={getCategoryBadge}
            onReviewReport={(report) => {
              setSelectedReport(report);
              setShowDialog(true);
            }}
          />
        </TabsContent>

        <TabsContent value="fraudulent">
          <ReportsTable 
            reports={reports.filter(r => r.category.toLowerCase() === 'fraudulent listing')}
            getCategoryBadge={getCategoryBadge}
            onReviewReport={(report) => {
              setSelectedReport(report);
              setShowDialog(true);
            }}
          />
        </TabsContent>

        <TabsContent value="inaccurate">
          <ReportsTable 
            reports={reports.filter(r => r.category.toLowerCase() === 'inaccurate information')}
            getCategoryBadge={getCategoryBadge}
            onReviewReport={(report) => {
              setSelectedReport(report);
              setShowDialog(true);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Report Review Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Review the reported content and take appropriate action
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Report Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Category:</span> {selectedReport.category}</p>
                    <p><span className="font-medium">Reporter:</span> {selectedReport.user?.name}</p>
                    <p><span className="font-medium">Date:</span> {format(new Date(selectedReport.created_at), 'PPpp')}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Property Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Title:</span> {selectedReport.property?.title}</p>
                    <Link 
                      href={`/properties/${selectedReport.property_id}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                      target="_blank"
                    >
                      <Eye className="w-4 h-4" />
                      View Property
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Report Description</h3>
                <p className="text-sm">{selectedReport.description}</p>
              </div>

              {selectedReport.image_urls && selectedReport.image_urls.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Evidence Images</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedReport.image_urls.map((url, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={url}
                          alt={`Evidence ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => handleDismissReport(selectedReport!.report_id)}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Dismiss Report
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteProperty(selectedReport!.property_id)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyReports;