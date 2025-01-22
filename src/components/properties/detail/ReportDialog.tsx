//src\components\properties\detail\ReportDialog.tsx

import React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  userId?: string;
}

const reportCategories = [
  'Inappropriate Content',
  'Inaccurate Information',
  'Fraudulent Listing',
  'Spam',
  'Offensive Language',
  'Others'
];

const ReportDialog = ({ isOpen, onClose, propertyId, userId }: ReportDialogProps) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!category) {
      setError('Please select a category');
      return;
    }

    if (!description) {
      setError('Please provide a description');
      return;
    }

    if (!userId) {
      setError('Please login to report a listing');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const reportData = {
        property_id: propertyId,
        user_id: userId,
        category,
        description,
        created_at: new Date().toISOString(),
      };

      const { error: submitError } = await supabase
        .from('report')
        .insert(reportData);

      if (submitError) throw submitError;

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        // Reset form
        setCategory('');
        setDescription('');
      }, 2000);

    } catch (err) {
      setError('Failed to submit report. Please try again.');
      console.error('Report submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      if (!isSubmitting) onClose();
    }}>
      <DialogContent className="sm:max-w-lg">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Report Listing</DialogTitle>
              <DialogDescription>
                Please provide details about why you&apos;re reporting this listing.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide details about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 h-12 w-12 text-green-500">
              <svg
                className="h-full w-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <DialogTitle className="mb-2">Report Submitted</DialogTitle>
            <DialogDescription>
              Thank you for your report. We will review it shortly.
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;