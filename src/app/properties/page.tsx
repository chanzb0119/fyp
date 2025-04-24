'use client';

import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PropertiesView from '@/components/properties/PropertiesView';

// Create a client component for the properties listing
function PropertiesContent() {
  return (<div className=" mx-auto px-10 lg:px-36 py-8">
    <PropertiesView />
  </div>);
}

// Main page component with Suspense boundary
export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto px-4 lg:px-36 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading properties...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}