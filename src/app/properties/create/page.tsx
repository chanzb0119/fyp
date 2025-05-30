// src\app\properties\create\page.tsx

import PropertyForm from '@/components/properties/create/PropertyForm';

export default function CreateProperty() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8">List Your Property</h1>
      <PropertyForm />
    </div>
  );
}