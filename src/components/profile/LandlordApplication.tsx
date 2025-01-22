//src\components\profile\LandlordApplication.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  FileEdit, 
  Shield, 
  Upload, 
  File, 
  X,
  AlertTriangle 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LandlordApplicationProps {
  onApply: (documentFile: File) => Promise<void>;
  isLoading?: boolean;
  previousApplication?: {
    status: string;
    createdAt: string;
    documentUrl?: string;
  } | null;
}

const LandlordApplication: React.FC<LandlordApplicationProps> = ({ 
  onApply,
  isLoading = false,
  previousApplication
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError('Please upload required document');
      return;
    }
    onApply(selectedFile);
    setShowUploadDialog(false);
  };

  // Allow reapplication if the status is 'rejected' or if there's no previous application
  const canApply = !previousApplication || previousApplication.status === 'rejected';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          Apply for Landlord Status
        </CardTitle>
        <CardDescription>
          Become a landlord to list your properties on our platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Previous Application Status */}
          {previousApplication && (
            <Alert variant={previousApplication.status === 'rejected' ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {previousApplication.status === 'rejected' ? (
                  "Your previous application was rejected. You can submit a new application."
                ) : previousApplication.status === 'pending' ? (
                  "Your application is under review. Please wait for admin approval."
                ) : (
                  "You have already submitted an application."
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <FileEdit className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Submit Application</h3>
                  <p className="text-sm text-gray-500">
                    Upload your proof of property ownership
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Get Verified</h3>
                  <p className="text-sm text-gray-500">
                    Our team will review your documents and verify your credentials
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Button or Previous Document Link */}
            <div className="mt-6">
              {previousApplication?.documentUrl && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <File className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Previous Document</p>
                      <a 
                        href={previousApplication.documentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={() => setShowUploadDialog(true)}
                className="w-full mt-4"
                disabled={!canApply || previousApplication?.status === 'pending'}
              >
                {previousApplication?.status === 'rejected' ? 'Submit New Application' : 'Upload Document'}
              </Button>
            </div>

            <div className="mt-6 border-t pt-6">
              <h4 className="font-semibold mb-2">Requirements:</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Proof of property ownership (e.g., title deed, recent tax bill)</li>
                <li>Document must be in PDF format</li>
                <li>File size should not exceed 5MB</li>
                <li>Document should be clear and legible</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload your proof of property ownership document
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {selectedFile ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-gray-50">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Drop your document here or click to upload
                </p>
                <p className="text-xs text-gray-500">
                  PDF only, max 5MB
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !selectedFile}
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LandlordApplication;